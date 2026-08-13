import * as docker from "@pulumi/docker";
import * as pulumi from "@pulumi/pulumi";

import { GROUP_LABELS } from "./utils";

export async function MinioContainer({
  network,
  provider,
  dependsOn,
}: {
  network: docker.Network;
  provider: docker.Provider;
  dependsOn?: pulumi.Input<pulumi.Resource>[];
}) {
  const config = new pulumi.Config("minio");
  const MINIO_ROOT_USER = config.requireSecret("root_user");
  const MINIO_ROOT_PASSWORD = config.requireSecret("root_password");
  const MINIO_API_PORT = Number.parseInt(config.require("api_port"), 10);
  const MINIO_CONSOLE_PORT = Number.parseInt(
    config.require("console_port"),
    10,
  );

  const image = new docker.RemoteImage(
    "minio-image",
    { name: "minio/minio:latest" },
    { provider },
  );

  const volume = new docker.Volume(
    "minio-data",
    { labels: GROUP_LABELS },
    { provider },
  );

  const container = new docker.Container(
    "minio-server",
    {
      command: ["server", "/data", "--console-address", ":9001"],
      envs: [
        `MINIO_ROOT_USER=${MINIO_ROOT_USER}`,
        `MINIO_ROOT_PASSWORD=${MINIO_ROOT_PASSWORD}`,
      ],
      image: image.name,
      labels: GROUP_LABELS,
      networksAdvanced: [{ name: network.name }],
      ports: [
        { external: MINIO_API_PORT, internal: 9000 },
        { external: MINIO_CONSOLE_PORT, internal: 9001 },
      ],
      restart: "unless-stopped",
      volumes: [{ containerPath: "/data", volumeName: volume.name }],
    },
    { dependsOn, provider },
  );

  return { container };
}
