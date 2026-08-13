import {
  maxLength,
  nullable,
  object,
  optional,
  pipe,
  regex,
  string,
} from "valibot";

import { NameSchema, SlugSchema } from "./common";

const HexColorSchema = pipe(
  string(),
  regex(
    /^#[0-9A-Fa-f]{6}$/,
    "Must be a valid 6-digit hex color (e.g., #3B82F6)",
  ),
);

const OptionalTextSchema = (label: string) =>
  optional(nullable(pipe(string(), maxLength(255, `${label} is too long`))));

const DateStringSchema = pipe(
  string(),
  regex(/^\d{4}-\d{2}-\d{2}$/, "Must be a valid date (YYYY-MM-DD)"),
);

export const UpdateOrganizationInputSchema = object({
  accentColor: optional(HexColorSchema),
  address: OptionalTextSchema("Address"),
  email: OptionalTextSchema("Email"),
  foundedDate: optional(DateStringSchema),
  industry: OptionalTextSchema("Industry"),
  locale: optional(string()),
  name: optional(NameSchema),
  phone: OptionalTextSchema("Phone"),
  registrationNumber: OptionalTextSchema("Registration number"),
  slug: optional(SlugSchema),
  taxId: OptionalTextSchema("Tax ID"),
  timezone: optional(string()),
  website: OptionalTextSchema("Website"),
});

export type UpdateOrganizationInput = {
  accentColor?: string;
  address?: string | null;
  email?: string | null;
  foundedDate?: string;
  industry?: string | null;
  locale?: string;
  name?: string;
  phone?: string | null;
  registrationNumber?: string | null;
  slug?: string;
  taxId?: string | null;
  timezone?: string;
  website?: string | null;
};
