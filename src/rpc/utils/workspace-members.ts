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
