import { CreateServiceProviderSchema } from "@aspen-os/management";

import { authMiddleware } from "../middlewares/auth";

export const listServiceProviders = authMiddleware.handler(async () => {
	const { pm } = await import("#/aspen/server");
	return pm.run("$global", () => pm.management.serviceProviders.list.run({}));
});

export const createServiceProvider = authMiddleware
	.input(CreateServiceProviderSchema)
	.handler(async ({ input }) => {
		const { pm } = await import("#/aspen/server");
		return pm.run("$global", () =>
			pm.management.serviceProviders.create.run(input),
		);
	});
