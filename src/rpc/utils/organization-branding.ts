/**
 * Organization branding lookups (login page, organization picker).
 *
 * Only inbuilt platform methods are used here — no direct DB access:
 *
 * - Public slug lookup and public list go through the ManagementPlane
 *   `tenants.getBySlug` / `tenants.listBranding` workflows (exact slug
 *   match on the unique column, no session required).
 * - "My organizations" (authenticated) uses the inbuilt better-auth
 *   `pm.auth.service.api.listOrganizations`, resolved from session headers.
 */

export interface OrganizationBranding {
	createdAt: string;
	id: string;
	logo: string | null;
	metadata: unknown;
	name: string;
	slug: string;
}

export interface OrganizationListItem {
	id: string;
	logo: string | null;
	name: string;
	slug: string;
}

export async function findOrganizationBrandingBySlug(
	slug: string,
): Promise<OrganizationBranding | null> {
	const { pm } = await import("#/aspen/server");
	const tenant = await pm.run("$global", () =>
		pm.management.tenants.getBySlug.run({ slug }),
	);
	if (!tenant) {
		return null;
	}
	return {
		createdAt: tenant.createdAt.toISOString(),
		id: tenant.id,
		logo: tenant.logo,
		metadata: tenant.metadata,
		name: tenant.name,
		slug: tenant.slug,
	};
}

export async function listOrganizationBranding(): Promise<
	OrganizationListItem[]
> {
	const { pm } = await import("#/aspen/server");
	return pm.run("$global", () => pm.management.tenants.listBranding.run({}));
}

/**
 * Lists the calling user's organizations via the inbuilt better-auth
 * endpoint. Takes request headers (session source) instead of a user id so
 * no member-table query is needed.
 */
export async function listMyOrganizationBranding(
	headers: Headers,
): Promise<OrganizationListItem[]> {
	const { pm } = await import("#/aspen/server");
	const organizations = await pm.run("$global", () =>
		pm.auth.service.api.listOrganizations({ headers }),
	);
	return organizations.map((organization) => ({
		id: organization.id,
		logo: organization.logo ?? null,
		name: organization.name,
		slug: organization.slug,
	}));
}
