import { Container, type Network, type Provider, Volume } from "@pulumi/docker";

import { postgresConfig } from "../utils";

export function PostgresContainer({
  network,
  provider,
}: {
  network: Network;
  provider: Provider;
}) {
  const user = postgresConfig.require("user");
  const password = postgresConfig.require("password");
  const db_name = postgresConfig.require("db");
  const port = postgresConfig.require("port");

  const volume = new Volume(
    "postgres-data",
    { name: "postgres-data" },
    { provider },
  );

  const container = new Container(
    "postgres-container",
    {
      envs: [
        `POSTGRES_USER=${user}`,
        `POSTGRES_PASSWORD=${password}`,
        `POSTGRES_DB=${db_name}`,
      ],
      image: "postgres:18-alpine",
      networksAdvanced: [{ name: network.name }],
      ports: [{ external: parseInt(port, 10), internal: 5432 }],
      restart: "on-failure",
      volumes: [
        {
          containerPath: "/var/lib/postgresql/18/data",
          volumeName: volume.name,
        },
      ],
    },
    { provider },
  );

  return { container, volume };
}
