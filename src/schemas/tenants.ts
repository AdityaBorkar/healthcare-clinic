import {
  boolean,
  integer,
  nullable,
  number,
  object,
  optional,
  pipe,
  string,
} from "valibot";

import { NameSchema, SlugSchema } from "./common";

export const ProvisionTenantSchema = object({
  databaseHost: optional(nullable(string())),
  databaseName: optional(nullable(string())),
  databasePassword: optional(nullable(string())),
  databasePort: optional(nullable(pipe(number(), integer()))),
  databaseSsl: optional(nullable(boolean())),
  databaseUser: optional(nullable(string())),
  logo: optional(nullable(string())),
  name: NameSchema,
  plan: optional(nullable(string())),
  serviceProviderId: optional(nullable(string())),
  slug: SlugSchema,
});
