import { env } from "#/env";
import { UpdateOrganizationInputSchema } from "#/schemas/organizations";
import { authed, base } from "../middlewares/auth";
import {
	findOrganizationBrandingBySlug,
	listMyOrganizationBranding,
	listOrganizationBranding,
} from "../organization-branding";
import {
	extractSubdomain,
	getWorkspaceOrganization,
	requireOrganizationSlug,
} from "../workspace";

export const getOrganizationBySubdomain = base.handler(async ({ context }) => {
	const host = context.headers.get("host");
	const subdomain = host ? extractSubdomain(host, env.PUBLIC_WEB_DOMAIN) : null;
	if (!subdomain) {
		return { organization: null, subdomain: null };
	}

	const organization = await findOrganizationBrandingBySlug(subdomain);
	return { organization, subdomain };
});

export const listOrganizations = base.handler(async () => {
	const organizations = await listOrganizationBranding();
	return { organizations };
});

export const listMyOrganizations = authed.handler(async ({ context }) => {
	const organizations = await listMyOrganizationBranding(
		context.session.user.id,
	);
	return { organizations };
});

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

export const getCurrentOrganization = authed.handler(async ({ context }) => {
	const organizationSlug = requireOrganizationSlug(context.headers);
	const workspaceOrg = await getWorkspaceOrganization(
		context.headers,
		organizationSlug,
	);

	const { pm } = await import("#/aspen/server");

	const tenant = await pm.run("$global", () =>
		pm.management.tenants.get.run({ id: workspaceOrg.id }),
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
});

export const updateCurrentOrganization = authed
	.input(UpdateOrganizationInputSchema)
	.handler(async ({ context, input }) => {
		const organizationSlug = requireOrganizationSlug(context.headers);
		const workspaceOrg = await getWorkspaceOrganization(
			context.headers,
			organizationSlug,
		);

		const { pm } = await import("#/aspen/server");

		const profile: Record<string, unknown> = {};
		if (input.name !== undefined) profile.name = input.name;
		if (input.slug !== undefined) profile.slug = input.slug;
		if (input.logo !== undefined) profile.logo = input.logo;

		const tenant = await pm.run("$global", () =>
			pm.management.tenants.update.run({
				id: workspaceOrg.id,
				profile:
					Object.keys(profile).length > 0 ? (profile as never) : undefined,
			}),
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
	});
