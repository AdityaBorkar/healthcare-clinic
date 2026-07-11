import { Config } from "@pulumi/pulumi";

export const postgresConfig = new Config("postgres");
export const appConfig = new Config("app");
