import * as docker from "@pulumi/docker";

import { MinioContainer } from "./docker/minio";
import { PostgresContainer } from "./docker/postgres";
import { GROUP_LABELS } from "./docker/utils";

const server_host = "unix:///var/run/docker.sock";

const provider = new docker.Provider("docker", { host: server_host });

const network = new docker.Network(
  "docker-network",
  { driver: "bridge", labels: GROUP_LABELS },
  { provider },
);

const postgres = PostgresContainer({
  network,
  provider,
});

const minio = await MinioContainer({
  dependsOn: [postgres.container],
  network,
  provider,
});

console.log(minio.container);
