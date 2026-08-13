import { execFileSync, spawn } from "node:child_process";
import { resolve } from "node:path";

import { Command } from "commander";

const PROJECT_DIR = resolve(import.meta.dir, "..");

const program = new Command()
  .name("run-command")
  .description(
    "Start a command with env vars sourced from the active Pulumi stack config",
  )
  .argument("[command...]", "command to run instead of the default vite dev")
  .allowExcessArguments(true)
  .option(
    "--stack <stack>",
    "Pulumi stack whose config drives the env",
    process.env.PULUMI_STACK ?? "dev",
  )
  .option(
    "--namespace <namespace>",
    "Pulumi config namespace holding the app env vars",
    process.env.PULUMI_ENV_NAMESPACE ?? "app",
  )
  .option("--verbose", "Print verbose output", false);

program.parse(process.argv);

const options = program.opts<{
  stack: string;
  namespace: string;
  verbose: boolean;
}>();
const { stack, namespace, verbose } = options;
const command = program.args;

type ConfigValue = { value?: string | object; secret?: boolean };
type ConfigSection = Record<string, ConfigValue>;

function loadConfig(stack: string, namespace: string): Record<string, string> {
  let stdout: string;

  try {
    stdout = execFileSync(
      "pulumi",
      ["config", "--json", "--show-secrets", "--stack", stack],
      { cwd: PROJECT_DIR, encoding: "utf8" },
    );
  } catch (error) {
    const err = error as NodeJS.ErrnoException & {
      stderr?: Buffer | string;
    };
    const detail =
      err.stderr?.toString().trim() || err.message || String(error);
    throw new Error(
      `Failed to read config for stack "${stack}": ${detail}` +
        (err.code === "ENOENT"
          ? ""
          : ` (is it selected? try "pulumi stack select ${stack}")`),
    );
  }

  const config = JSON.parse(stdout) as ConfigSection;

  const env: Record<string, string> = {};

  for (const [key, entry] of Object.entries(config)) {
    const separator = key.indexOf(":");
    const keyNamespace = separator === -1 ? "" : key.slice(0, separator);
    if (keyNamespace !== namespace) continue;

    const name = separator === -1 ? key : key.slice(separator + 1);
    if (!name || entry.value === undefined) continue;

    env[name] =
      typeof entry.value === "string"
        ? entry.value
        : JSON.stringify(entry.value);
  }

  return env;
}

function main() {
  const env = loadConfig(stack, namespace);

  console.log(`[${stack}] ${command.join(" ")}`);
  if (verbose) {
    console.log(`Env Injected:\n - ${Object.keys(env).sort().join("\n - ")}`);
  }

  const [commandName, ...commandArgs] = command;
  if (!commandName) throw new Error("No command to run");

  const child = spawn(commandName, commandArgs, {
    cwd: PROJECT_DIR,
    env: { ...process.env, ...env },
    stdio: "inherit",
  });

  for (const signal of ["SIGINT", "SIGTERM"] as const) {
    process.on(signal, () => child.kill(signal));
  }

  child.on("exit", (code, signal) => {
    if (signal) process.kill(process.pid, signal);
    else process.exit(code ?? 1);
  });
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
