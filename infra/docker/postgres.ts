import * as docker from "@pulumi/docker";
import * as pulumi from "@pulumi/pulumi";

import { GROUP_LABELS } from "./utils";

export function postgresContainer({
  network,
  provider,
}: {
  network: docker.Network;
  provider: docker.Provider;
}) {
  const config = new pulumi.Config("postgres");
  const port = config.requireNumber("DB_PORT");
  const user = {
    name: config.require("DB_USER"),
    password: config.require("DB_PASSWORD"),
  };

  const image = new docker.RemoteImage(
    "postgres-image",
    { name: "postgres:18-alpine" },
    { provider },
  );

  const volume = new docker.Volume("postgres-data", { labels: GROUP_LABELS }, { provider });

  const container = new docker.Container(
    "postgres-container",
    {
      command: [
        "postgres",
        // "-c",
        // "config_file=/etc/postgresql/postgresql.conf",
        "-c",
        "shared_buffers=256MB",
        "-c",
        "max_connections=200",
        "-c",
        "effective_cache_size=1GB",
        "-c",
        "work_mem=8MB",
        "-c",
        "maintenance_work_mem=64MB",
        "-c",
        "wal_level=replica",
        "-c",
        "max_wal_senders=10",
        "-c",
        "max_replication_slots=10",
        "-c",
        "synchronous_commit=on",
        "-c",
        "checkpoint_completion_target=0.9",
        "-c",
        "max_worker_processes=8",
        "-c",
        "max_parallel_workers_per_gather=4",
        "-c",
        "max_parallel_workers=8",
        "-c",
        "log_min_duration_statement=100",
        "-c",
        "log_statement=ddl",
        "-c",
        "log_checkpoints=on",
        "-c",
        "log_connections=on",
        "-c",
        "log_disconnections=on",
        "-c",
        "row_security=off",
      ],
      envs: [
        pulumi.interpolate`POSTGRES_USER=${user.name}`,
        pulumi.interpolate`POSTGRES_PASSWORD=${user.password}`,
        pulumi.interpolate`POSTGRES_DB=control_plane`,
        "POSTGRES_INITDB_ARGS=--data-checksums --encoding=UTF8",
      ],
      healthcheck: {
        interval: "10s",
        retries: 5,
        tests: ["CMD-SHELL", "pg_isready -U aspen -d aspen"],
        timeout: "5s",
      },
      image: image.name,
      labels: GROUP_LABELS,
      networksAdvanced: [{ name: network.name }],
      ports: [{ external: port, internal: 5432 }],
      restart: "unless-stopped",
      volumes: [
        {
          containerPath: "/var/lib/postgresql/18/data",
          volumeName: volume.name,
        },
      ],
    },
    { provider },
  );

  const local_url = pulumi.interpolate`postgres://${user.name}:${user.password}@localhost:${port}`;
  const container_url = pulumi.interpolate`postgres://${user.name}:${user.password}@${container.name}:${port}`;

  return { container, server: { container_url, local_url } };
}
