/**
 * Public organization branding lookups (login page, organization picker).
 *
 * Raw SQL is intentional here: better-auth's organization endpoints require a
 * session *and* workspace membership, but these run for logged-out visitors.
 * postgres-js `unsafe` with `$n` parameters is still parameterized, and all
 * branding SQL lives in this module so the table coupling has exactly one
 * home.
 */

export interface OrganizationBranding {
	createdAt: string;
	id: string;
	logo: string | null;
	metadata: unknown;
	name: string;
	slug: string;
}

interface OrganizationBrandingRow {
	created_at: Date;
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
	return pm.run("$global", async () => {
		const rows = await pm.db.pool.unsafe<OrganizationBrandingRow[]>(
			`SELECT id, name, slug, logo, metadata, created_at
         FROM organization
         WHERE slug = $1
         LIMIT 1`,
			[slug],
		);
		const [row] = rows;
		if (!row) {
			return null;
		}
		return {
			createdAt: row.created_at.toISOString(),
			id: row.id,
			logo: row.logo,
			metadata: row.metadata,
			name: row.name,
			slug: row.slug,
		};
	});
}

export async function listOrganizationBranding(): Promise<
	OrganizationListItem[]
> {
	const { pm } = await import("#/aspen/server");
	return pm.run("$global", () =>
		pm.db.pool.unsafe<OrganizationListItem[]>(
			`SELECT id, name, slug, logo
         FROM organization
         ORDER BY name ASC`,
		),
	);
}
