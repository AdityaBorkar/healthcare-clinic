import { UpdateTenantProfileSchema } from "@aspen-os/management";

import { env } from "#/env";
import { authMiddleware, base } from "../middlewares/auth";
import {
	extractSubdomain,
	requireOrganizationSlug,
} from "../middlewares/scoped_auth";

export const getOrganizationBySubdomain = base.handler(async ({ context }) => {
	const host = context.headers.get("host");
	const subdomain = host ? extractSubdomain(host, env.PUBLIC_WEB_DOMAIN) : null;
	if (!subdomain) {
		return { organization: null, subdomain: null };
	}

	const { pm } = await import("#/aspen/server");
	const tenant = await pm.run("$global", () =>
		pm.management.tenants.getBySlug.run({ slug: subdomain }),
	);
	if (!tenant) {
		return { organization: null, subdomain: null };
	}
	const organization = {
		createdAt: tenant.createdAt.toISOString(),
		id: tenant.id,
		logo: tenant.logo,
		metadata: tenant.metadata,
		name: tenant.name,
		slug: tenant.slug,
	};

	return { organization, subdomain };
});

export const listOrganizations = base.handler(async () => {
	const { pm } = await import("#/aspen/server");
	const organizations = await pm.run("$global", () =>
		pm.management.tenants.listBranding.run({}),
	);
	return { organizations };
});

export const listMyOrganizations = authMiddleware.handler(
	async ({ context }) => {
		const { pm } = await import("#/aspen/server");
		const organizations = await pm.run("$global", () =>
			pm.management.tenants.listByUser.run({
				userId: context.session.user.id,
			}),
		);

		return { organizations };
	},
);

type TenantOrganizationRow = {
	createdAt: Date;
	id: string;
	logo: string | null;
	metadata: unknown;
	name: string;
	plan: string | null;
	serviceProviderId: string | null;
	slug: string;
	status: string | null;
};

function toOrganizationDto(org: TenantOrganizationRow) {
	return {
		createdAt: org.createdAt.toISOString(),
		id: org.id,
		logo: org.logo,
		metadata: org.metadata,
		name: org.name,
		plan: org.plan,
		serviceProviderId: org.serviceProviderId,
		slug: org.slug,
		status: org.status,
	};
}

export const getCurrentOrganization = authMiddleware.handler(
	async ({ context }) => {
		const organizationSlug = requireOrganizationSlug(context.headers);

		const { pm } = await import("#/aspen/server");

		const tenant = await pm.run("$global", () =>
			pm.management.tenants.getFullBySlug.run({ slug: organizationSlug }),
		);

		return toOrganizationDto({
			createdAt: tenant.createdAt,
			id: tenant.id,
			logo: tenant.logo,
			metadata: tenant.metadata,
			name: tenant.name,
			plan: tenant.plan,
			serviceProviderId: tenant.serviceProviderId,
			slug: tenant.slug,
			status: tenant.status,
		});
	},
);

export const updateCurrentOrganization = authMiddleware
	.input(UpdateTenantProfileSchema)
	.handler(async ({ context, input }) => {
		const organizationSlug = requireOrganizationSlug(context.headers);

		const { pm } = await import("#/aspen/server");

		const tenant = await pm.run("$global", async () => {
			const current = await pm.management.tenants.getFullBySlug.run({
				slug: organizationSlug,
			});
			return pm.management.tenants.update.run({
				id: current.id,
				profile: input,
			});
		});

		return toOrganizationDto({
			createdAt: tenant.createdAt,
			id: tenant.id,
			logo: tenant.logo,
			metadata: tenant.metadata,
			name: tenant.name,
			plan: tenant.plan,
			serviceProviderId: tenant.serviceProviderId,
			slug: tenant.slug,
			status: tenant.status,
		});
	});
