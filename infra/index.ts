import { Network, Provider } from "@pulumi/docker";

import { AppContainer } from "./docker/app";
import { PostgresContainer } from "./docker/postgres";

const provider = new Provider("docker-provider", {
  host: "unix:///var/run/docker.sock",
});

const network = new Network("docker-network", { name: "network" });
PostgresContainer({ network, provider });
AppContainer({ network, provider });
