import { os } from "@orpc/server";

import { f } from "@/aspen/server";
import { BrandingUpdateSchema, OrganizationUpdateSchema } from "../schema";

const base = os.$context<Record<string, never>>();

export const get = base.handler(async () => {
  return f.organization.organization.get();
});

export const update = base
  .input(OrganizationUpdateSchema)
  .handler(async ({ input }) => {
    return f.organization.organization.update(input);
  });

export const updateBranding = base
  .input(BrandingUpdateSchema)
  .handler(async ({ input }) => {
    return f.organization.organization.updateBranding(input);
  });
