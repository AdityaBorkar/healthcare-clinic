import * as docker from "@pulumi/docker";

// import { MinioContainer } from "./docker/minio";
import { PostgresContainer } from "./docker/postgres";
import { GROUP_LABELS } from "./docker/utils";

// Provisioning

// TODO: Provision a Server

// Docker

const server_host = "unix:///var/run/docker.sock";

const provider = new docker.Provider("docker", { host: server_host });

const network = new docker.Network(
  "docker-network",
  { driver: "bridge", labels: GROUP_LABELS },
  { provider },
);

const postgres = PostgresContainer({ network, provider });

// TODO: Replace using SeaweedFS
// const minio = await MinioContainer({
//   dependsOn: [postgres.container],
//   network,
//   provider,
// });

// TODO: Run Database Migrations

// TODO: Start Application

// TODO: Run Caddy and reverse proxy

// Outputs

postgres.container;
