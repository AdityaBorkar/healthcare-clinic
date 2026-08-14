import { authed } from "../middlewares/auth";
import { CreateServiceProviderSchema } from "@/schemas/service-providers";

export const listServiceProviders = authed.handler(async () => {
  const { pm } = await import("@/aspen/server");
  return pm.run("$global", () => pm.management.serviceProviders.list.run({}));
});

export const createServiceProvider = authed
  .input(CreateServiceProviderSchema)
  .handler(async ({ input }) => {
    const { pm } = await import("@/aspen/server");
    return pm.run("$global", () => pm.management.serviceProviders.create.run({ input }));
  });
