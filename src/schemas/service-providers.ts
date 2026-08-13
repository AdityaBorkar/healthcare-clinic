import { nullable, object, optional, pipe, regex, string } from "valibot";

import { NameSchema, SlugSchema } from "./common";

const EmailSchema = pipe(
  string(),
  regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Must be a valid email address"),
);

const WebsiteSchema = pipe(
  string(),
  regex(/^https?:\/\/.+/, "Must start with http:// or https://"),
);

export const CreateServiceProviderSchema = object({
  address: optional(nullable(string())),
  description: optional(nullable(string())),
  email: EmailSchema,
  logo: optional(nullable(string())),
  name: NameSchema,
  phone: optional(nullable(string())),
  slug: SlugSchema,
  website: WebsiteSchema,
});
