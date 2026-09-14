import { ProvisionTenantSchema } from "#/schemas/tenants";
import { authMiddleware } from "../middlewares/auth";

export const listTenants = authMiddleware.handler(async () => {
	const { pm } = await import("#/aspen/server");
	return pm.run("$global", () => pm.management.tenants.list.run({}));
});

export const onboardTenant = authMiddleware
	.input(ProvisionTenantSchema)
	.handler(async ({ context, input }) => {
		const { pm } = await import("#/aspen/server");
		return pm.run("$global", () =>
			pm.management.tenants.onboard.run({
				tenant: input,
				userId: context.session.user.id,
			}),
		);
	});
