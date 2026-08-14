import { email, minLength, object, optional, picklist, pipe, string } from "valibot";

import { NameSchema } from "./common";

export const OrganizationUserRoleSchema = picklist(["admin", "member"]);

const PasswordSchema = pipe(string(), minLength(8, "Password must be at least 8 characters"));

export const CreateTenantUserSchema = object({
  email: pipe(string(), email("Enter a valid email address")),
  name: NameSchema,
  password: PasswordSchema,
  role: OrganizationUserRoleSchema,
});

export const UpdateTenantUserSchema = object({
  name: optional(NameSchema),
  role: optional(OrganizationUserRoleSchema),
});

export const TenantUserIdSchema = object({
  id: pipe(string(), minLength(1, "User ID is required")),
});

export const UpdateTenantUserInputSchema = object({
  id: pipe(string(), minLength(1, "User ID is required")),
  patch: UpdateTenantUserSchema,
});
