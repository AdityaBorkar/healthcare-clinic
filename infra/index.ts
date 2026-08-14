import * as docker from "@pulumi/docker";

// Import { MinioContainer } from "./docker/minio";
import { postgresContainer } from "./docker/postgres";
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

const postgres = postgresContainer({ network, provider });

// TODO: Replace using SeaweedFS
// Const minio = await MinioContainer({
//   DependsOn: [postgres.container],
//   Network,
//   Provider,
// });

// TODO: Run Database Migrations

// TODO: Start Application

// TODO: Run Caddy and reverse proxy

// Outputs

console.log(postgres.container.wait);
