import { spawn } from "node:child_process";

import { Container, Image, type Network, type Provider } from "@pulumi/docker";
import * as pulumi from "@pulumi/pulumi";

import { appConfig, postgresConfig } from "../utils";

const stage = pulumi.getStack();

const domain = appConfig.require("domain");
const port = appConfig.require("port");
const ssl = appConfig.require("ssl");
const authSecret = appConfig.require("auth_secret");
const googleClientId = appConfig.require("google_client_id");
const googleClientSecret = appConfig.require("google_client_secret");
const storageAccessKey = appConfig.require("storage_access_key");
const storageBucket = appConfig.require("storage_bucket");
const storageEndpoint = appConfig.require("storage_endpoint");
const storageForcePathStyle = appConfig.require("storage_force_path_style");
const storageRegion = appConfig.require("storage_region");
const storageSecretKey = appConfig.require("storage_secret_key");

function buildEnvMap(): Record<string, string> {
  return {
    AUTH_SECRET: authSecret,
    DB_HOST: postgresConfig.require("host"),
    DB_NAME: postgresConfig.require("db"),
    DB_PASSWORD: postgresConfig.require("password"),
    DB_PORT: postgresConfig.require("port"),
    DB_SSL: postgresConfig.require("ssl"),
    DB_USER: postgresConfig.require("user"),
    GOOGLE_CLIENT_ID: googleClientId,
    GOOGLE_CLIENT_SECRET: googleClientSecret,
    PUBLIC_WEB_DOMAIN: domain,
    PUBLIC_WEB_PORT: port,
    PUBLIC_WEB_SSL: ssl,
    STORAGE_ACCESS_KEY: storageAccessKey,
    STORAGE_BUCKET: storageBucket,
    STORAGE_ENDPOINT: storageEndpoint,
    STORAGE_FORCE_PATH_STYLE: storageForcePathStyle,
    STORAGE_REGION: storageRegion,
    STORAGE_SECRET_KEY: storageSecretKey,
  };
}

function buildEnv(): string[] {
  return Object.entries(buildEnvMap()).map(([k, v]) => `${k}=${v}`);
}

interface DevServerProviderArgs {
  env: string[];
}

class DevServerProvider implements pulumi.dynamic.ResourceProvider {
  private child: ReturnType<typeof spawn> | null = null;

  async create(
    inputs: DevServerProviderArgs,
  ): Promise<pulumi.dynamic.CreateResult> {
    this.start(inputs.env);
    return { id: `dev-server-${Date.now()}`, outs: {} };
  }

  async update(
    _id: string,
    _olds: DevServerProviderArgs,
    news: DevServerProviderArgs,
  ): Promise<pulumi.dynamic.UpdateResult> {
    this.stop();
    this.start(news.env);
    return { outs: {} };
  }

  async delete(_id: string, _props: DevServerProviderArgs): Promise<void> {
    this.stop();
  }

  private start(env: string[]) {
    const merged = {
      ...process.env,
      ...Object.fromEntries(
        env.map((e) => e.split("=", 2) as [string, string]),
      ),
    };

    this.child = spawn("bun", ["--bun", "run", "dev"], {
      env: merged,
      stdio: "inherit",
    });

    this.child.on("exit", (code) => {
      if (code !== 0 && code !== null) {
        console.error(`\x1b[31mDev server exited with code ${code}\x1b[0m`);
      }
      this.child = null;
    });

    this.child.on("error", (err) => {
      console.error(
        `\x1b[31mFailed to start dev server: ${err.message}\x1b[0m`,
      );
      this.child = null;
    });
  }

  private stop() {
    if (this.child) {
      this.child.kill("SIGTERM");
      this.child = null;
      console.log("\x1b[33mDev server stopped\x1b[0m");
    }
  }
}

class DevServer extends pulumi.dynamic.Resource {
  constructor(
    name: string,
    _args: DevServerProviderArgs,
    opts?: pulumi.CustomResourceOptions,
  ) {
    super(new DevServerProvider(), name, {}, opts);
  }
}

export function AppContainer({
  network,
  provider,
}: {
  network: Network;
  provider: Provider;
}) {
  if (stage === "dev") {
    const env = buildEnv();

    const server = new DevServer("dev-server", { env });

    return { server };
  }

  const image = new Image(
    "app-image",
    {
      build: {
        args: buildEnvMap(),
        context: "..",
        dockerfile: "../Dockerfile",
      },
      imageName: "healthcare-clinic:latest",
      skipPush: true,
    },
    { provider },
  );

  const container = new Container(
    "app-container",
    {
      envs: buildEnv(),
      image: image.baseImageName,
      name: "healthcare-clinic",
      networksAdvanced: [{ name: network.name }],
      ports: [{ external: parseInt(port, 10), internal: 3000 }],
      restart: "on-failure",
    },
    { provider },
  );

  return { container, image };
}
