import { CreateServiceProviderSchema } from "@/schemas/service-providers";
import { authed } from "../middlewares/auth";

export const listServiceProviders = authed.handler(async () => {
  const { p } = await import("@/aspen/server");
  return p.run("$global", () => p.management.serviceProviders.list.run({}));
});

export const createServiceProvider = authed
  .input(CreateServiceProviderSchema)
  .handler(async ({ input }) => {
    const { p } = await import("@/aspen/server");
    return p.run("$global", () =>
      p.management.serviceProviders.create.run({ input }),
    );
  });
