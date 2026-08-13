import { resolve } from "node:path";
import { $ } from "bun";

import {
  cancel,
  intro,
  isCancel,
  log,
  outro,
  password,
  spinner,
} from "@clack/prompts";
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

async function runConfig(stack: string, passphrase: string): Promise<string> {
  const result = await $.cwd(PROJECT_DIR).env({
    ...process.env,
    PULUMI_CONFIG_PASSPHRASE: passphrase,
  })`pulumi config --json --show-secrets --stack ${stack}`
    .quiet()
    .nothrow();

  if (result.exitCode !== 0) {
    const detail =
      result.stderr.toString().trim() ||
      result.stdout.toString().trim() ||
      `exited with code ${result.exitCode}`;
    throw new Error(
      `Failed to read config for stack "${stack}": ${detail} (is it selected? try "pulumi stack select ${stack}")`,
    );
  }

  return result.stdout.toString();
}

async function loadConfig(
  stack: string,
  namespace: string,
  passphrase: string,
): Promise<Record<string, string>> {
  const config = JSON.parse(
    await runConfig(stack, passphrase),
  ) as ConfigSection;

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

async function main() {
  intro(`Healthcare Clinic · stack "${stack}"`);

  const passphrase =
    process.env.PULUMI_CONFIG_PASSPHRASE ??
    (await password({
      mask: "*",
      message: `Pulumi config passphrase for stack "${stack}"`,
    }));
  if (isCancel(passphrase)) {
    cancel("Operation cancelled.");
    process.exit(0);
  }

  const spin = spinner();
  spin.start(`Reading config for stack "${stack}"`);

  let env: Record<string, string>;
  try {
    env = await loadConfig(stack, namespace, passphrase);
  } catch (error) {
    spin.stop("Failed");
    log.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
  spin.stop(`Config loaded for stack "${stack}"`);

  if (verbose) {
    log.info(`Env Injected:\n - ${Object.keys(env).sort().join("\n - ")}`);
  }

  const [commandName, ...commandArgs] = command;
  if (!commandName) throw new Error("No command to run");

  log.step(`${stack} $ ${command.join(" ")}`);

  const child = Bun.spawn([commandName, ...commandArgs], {
    cwd: PROJECT_DIR,
    env: { ...process.env, ...env },
    stdio: ["inherit", "inherit", "inherit"],
  });

  for (const signal of ["SIGINT", "SIGTERM"] as const) {
    process.on(signal, () => child.kill(signal));
  }

  await child.exited;
  outro("Done");

  if (child.signalCode) process.kill(process.pid, child.signalCode);
  else process.exit(child.exitCode ?? 1);
}

try {
  await main();
} catch (error) {
  log.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
