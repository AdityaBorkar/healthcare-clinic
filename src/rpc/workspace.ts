import { env } from "#/env";

const SUBDOMAIN_PATTERN = /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;

/**
 * Extracts the tenant subdomain from a request Host header by stripping the
 * app's apex domain (PUBLIC_WEB_DOMAIN). Returns null when the request is
 * hitting the apex domain itself or a host we don't serve.
 *
 * @example
 *   ("acme.localhost:3000", "localhost") => "acme"
 *   ("localhost:3000", "localhost")       => null
 *   ("acme.example.com", "example.com")   => "acme"
 *   ("example.com", "example.com")        => null
 */
export function extractSubdomain(
	host: string,
	appDomain: string,
): string | null {
	const hostname = host.split(":")[0]?.toLowerCase() ?? "";
	const suffix = `.${appDomain.toLowerCase()}`;
	if (!hostname.endsWith(suffix)) {
		return null;
	}
	const subdomain = hostname.slice(0, -suffix.length);
	return subdomain.length > 0 && SUBDOMAIN_PATTERN.test(subdomain)
		? subdomain
		: null;
}

export function getOrganizationSlug(headers: Headers): string | null {
	const host = headers.get("host");
	return host ? extractSubdomain(host, env.PUBLIC_WEB_DOMAIN) : null;
}

export function requireOrganizationSlug(headers: Headers): string {
	const slug = getOrganizationSlug(headers);
	if (!slug) {
		throw new Error("This request is not associated with a workspace");
	}
	return slug;
}

export interface WorkspaceMember {
	createdAt: Date;
	id: string;
	role: string;
	user: { email: string; id: string; name: string };
}

export interface WorkspaceUser {
	createdAt: string;
	email: string;
	id: string;
	name: string;
	role: string;
	userId: string;
}

/**
 * Single mapper for workspace members. `createdAt` is serialized to ISO here
 * (matching the organization DTO) so server-direct and HTTP callers observe
 * the same shape.
 */
export function toWorkspaceUser(member: WorkspaceMember): WorkspaceUser {
	return {
		createdAt: member.createdAt.toISOString(),
		email: member.user.email,
		id: member.id,
		name: member.user.name,
		role: member.role,
		userId: member.user.id,
	};
}

export async function listWorkspaceMembers(
	headers: Headers,
	organizationSlug: string,
): Promise<WorkspaceUser[]> {
	const { pm } = await import("#/aspen/server");
	const result = await pm.run("$global", () =>
		pm.auth.service.api.listMembers({
			headers,
			query: { organizationSlug },
		}),
	);
	return result.members.map(toWorkspaceUser);
}

/**
 * better-auth exposes no get-member-by-id endpoint, so single-member reads go
 * through the list endpoint with a server-side id filter instead of fetching
 * every member and filtering in memory.
 */
export async function findWorkspaceMember(
	headers: Headers,
	organizationSlug: string,
	memberId: string,
): Promise<WorkspaceUser> {
	const { pm } = await import("#/aspen/server");
	const result = await pm.run("$global", () =>
		pm.auth.service.api.listMembers({
			headers,
			query: {
				filterField: "id",
				filterOperator: "eq",
				filterValue: memberId,
				limit: 1,
				organizationSlug,
			},
		}),
	);
	const [member] = result.members;
	if (!member) {
		throw new Error("User not found in this workspace");
	}
	return toWorkspaceUser(member);
}

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
