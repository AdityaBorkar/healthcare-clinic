import { requireOrganizationSlug } from "./subdomain";

export async function getWorkspaceOrganization(
	headers: Headers,
	organizationSlug: string,
) {
	const { pm } = await import("#/aspen/server");
	const organization = await pm.run("$global", () =>
		pm.auth.service.api.getFullOrganization({
			headers,
			query: { organizationSlug },
		}),
	);
	if (!organization) {
		throw new Error("Workspace not found");
	}
	return organization;
}

/**
 * Single home for the "workspace administrator" policy. Read endpoints stay
 * member-visible (better-auth already rejects non-members); only mutations
 * that change workspace membership or roles require owner/admin.
 */
export function requireWorkspaceAdmin(
	organization: { members: Array<{ role: string; user: { id: string } }> },
	session: { user: { id: string } },
	action: string,
): void {
	const currentMember = organization.members.find(
		({ user }) => user.id === session.user.id,
	);
	if (!currentMember || !["owner", "admin"].includes(currentMember.role)) {
		throw new Error(`Only workspace administrators can ${action}`);
	}
}

/**
 * Renames the underlying auth account. Kept behind a helper so procedures
 * don't reach through `pm.auth.rest` directly.
 */
export async function renameAuthUser(
	userId: string,
	name: string,
): Promise<void> {
	const { pm } = await import("#/aspen/server");
	await pm.run("$global", () =>
		pm.auth.rest.user.update({ data: { name }, id: userId }),
	);
}

/**
 * Resolves the tenant database name for the organization behind the current
 * request so organization module workflows can run inside that tenant's
 * database context.
 */
export async function resolveTenantDatabaseName(
	headers: Headers,
): Promise<string> {
	const organizationSlug = requireOrganizationSlug(headers);
	const organization = await getWorkspaceOrganization(
		headers,
		organizationSlug,
	);

	const { pm } = await import("#/aspen/server");
	const tenant = await pm.run("$global", () =>
		pm.management.tenants.get.run({ id: organization.id }),
	);
	if (!tenant.databaseName) {
		throw new Error("Workspace database is not configured");
	}
	return tenant.databaseName;
}
