import {
	CreateTenantMemberPayloadSchema,
	TenantMemberIdPayloadSchema,
	UpdateTenantMemberPayloadSchema,
} from "@aspen-os/management";

import { scopedAuthMiddleware } from "../middlewares/scoped_auth";

export const listUsers = scopedAuthMiddleware.handler(async ({ context }) => {
	const { organizationSlug, pm } = context;
	return pm.run("$global", () =>
		pm.management.tenantMembers.list.run({ slug: organizationSlug }),
	);
});

export const getUser = scopedAuthMiddleware
	.input(TenantMemberIdPayloadSchema)
	.handler(async ({ context, input }) => {
		const { organizationSlug, pm } = context;
		return pm.run("$global", () =>
			pm.management.tenantMembers.get.run({
				id: input.id,
				slug: organizationSlug,
			}),
		);
	});

export const createUser = scopedAuthMiddleware
	.input(CreateTenantMemberPayloadSchema)
	.handler(async ({ context, input }) => {
		const { organizationSlug, pm } = context;
		return pm.run("$global", () =>
			pm.management.tenantMembers.create.run({
				email: input.email,
				name: input.name,
				password: input.password,
				role: input.role,
				slug: organizationSlug,
			}),
		);
	});

export const updateUser = scopedAuthMiddleware
	.input(UpdateTenantMemberPayloadSchema)
	.handler(async ({ context, input }) => {
		const { organizationSlug, pm } = context;
		return pm.run("$global", () =>
			pm.management.tenantMembers.update.run({
				id: input.id,
				patch: input.patch,
				slug: organizationSlug,
			}),
		);
	});

export const removeUser = scopedAuthMiddleware
	.input(TenantMemberIdPayloadSchema)
	.handler(async ({ context, input }) => {
		const { organizationSlug, pm } = context;
		return pm.run("$global", () =>
			pm.management.tenantMembers.remove.run({
				id: input.id,
				slug: organizationSlug,
			}),
		);
	});
