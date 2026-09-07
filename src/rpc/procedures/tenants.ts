import { ProvisionTenantSchema } from "#/schemas/tenants";
import { authed } from "../middlewares/auth";

export const listTenants = authed.handler(async () => {
	const { pm } = await import("#/aspen/server");
	return pm.run("$global", () => pm.management.tenants.list.run({}));
});

export const onboardTenant = authed
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
