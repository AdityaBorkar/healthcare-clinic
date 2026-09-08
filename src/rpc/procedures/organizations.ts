import { env } from "#/env";
import { UpdateOrganizationInputSchema } from "#/schemas/organizations";
import { authed, base } from "../middlewares/auth";
import {
	findOrganizationBrandingBySlug,
	listOrganizationBranding,
} from "../organization-branding";
import { extractSubdomain, resolveTenantDatabaseName } from "../workspace";

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

type OrganizationModuleRow = {
	accentColor: string;
	address: string | null;
	createdAt: Date;
	email: string | null;
	foundedDate: string | null;
	id: string;
	industry: string | null;
	locale: string;
	logo: string | null;
	metadata: unknown;
	name: string;
	phone: string | null;
	registrationNumber: string | null;
	slug: string;
	status: string;
	taxId: string | null;
	timezone: string;
	updatedAt: Date;
	website: string | null;
};

function toOrganizationDto(org: OrganizationModuleRow) {
	return {
		accentColor: org.accentColor,
		address: org.address,
		createdAt: org.createdAt.toISOString(),
		email: org.email,
		foundedDate: org.foundedDate,
		id: org.id,
		industry: org.industry,
		locale: org.locale,
		logo: org.logo,
		metadata: org.metadata,
		name: org.name,
		phone: org.phone,
		registrationNumber: org.registrationNumber,
		slug: org.slug,
		status: org.status,
		taxId: org.taxId,
		timezone: org.timezone,
		updatedAt: org.updatedAt.toISOString(),
		website: org.website,
	};
}

export const getCurrentOrganization = authed.handler(async ({ context }) => {
	const tenantDatabaseName = await resolveTenantDatabaseName(context.headers);

	const { pm } = await import("#/aspen/server");

	const organization = await pm.run(tenantDatabaseName, () =>
		pm.organization.organizations.get.run({}),
	);

	if (!organization) {
		throw new Error("Workspace organization not found");
	}

	return toOrganizationDto(organization);
});

export const updateCurrentOrganization = authed
	.input(UpdateOrganizationInputSchema)
	.handler(async ({ context, input }) => {
		const tenantDatabaseName = await resolveTenantDatabaseName(context.headers);

		const { pm } = await import("#/aspen/server");

		const organization = await pm.run(tenantDatabaseName, () =>
			pm.organization.organizations.update.run({
				accentColor: input.accentColor,
				address: input.address,
				email: input.email,
				foundedDate: input.foundedDate
					? new Date(`${input.foundedDate}T00:00:00Z`)
					: undefined,
				industry: input.industry,
				locale: input.locale,
				name: input.name,
				phone: input.phone,
				registrationNumber: input.registrationNumber,
				slug: input.slug,
				taxId: input.taxId,
				timezone: input.timezone,
				website: input.website,
			}),
		);

		return toOrganizationDto(organization);
	});
