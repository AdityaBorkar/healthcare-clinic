import {
	CreateTenantUserSchema,
	TenantUserIdSchema,
	UpdateTenantUserInputSchema,
} from "#/schemas/users";
import { authed } from "../middlewares/auth";
import { requireOrganizationSlug } from "../utils/subdomain";
import {
	findWorkspaceMember,
	listWorkspaceMembers,
	toWorkspaceUser,
} from "../utils/workspace-members";
import {
	getWorkspaceOrganization,
	renameAuthUser,
	requireWorkspaceAdmin,
} from "../utils/workspace-organization";

export const listUsers = authed.handler(async ({ context }) => {
	const organizationSlug = requireOrganizationSlug(context.headers);
	return listWorkspaceMembers(context.headers, organizationSlug);
});

export const getUser = authed
	.input(TenantUserIdSchema)
	.handler(async ({ context, input }) => {
		const organizationSlug = requireOrganizationSlug(context.headers);
		return findWorkspaceMember(context.headers, organizationSlug, input.id);
	});

export const createUser = authed
	.input(CreateTenantUserSchema)
	.handler(async ({ context, input }) => {
		const organizationSlug = requireOrganizationSlug(context.headers);
		const organization = await getWorkspaceOrganization(
			context.headers,
			organizationSlug,
		);
		requireWorkspaceAdmin(organization, context.session, "add users");

		const { pm } = await import("#/aspen/server");

		return pm.run("$global", async () => {
			const created = await pm.management.users.create.run({
				email: input.email,
				name: input.name,
				password: input.password,
				role: input.role === "admin" ? "tenant_admin" : "tenant_user",
				spId: null,
			});

			// Auth-account creation and workspace membership are separate systems
			// with no shared transaction, so a failed addMember compensates by
			// deleting the orphaned account. Rollback failures are logged without
			// masking the original error.
			try {
				const member = await pm.auth.service.api.addMember({
					body: {
						organizationId: organization.id,
						role: input.role,
						userId: created.id,
					},
					headers: context.headers,
				});
				return toWorkspaceUser({
					createdAt: member.createdAt,
					id: member.id,
					role: member.role,
					user: { email: input.email, id: created.id, name: input.name },
				});
			} catch (error) {
				await pm.management.users.delete
					.run({ id: created.id })
					.catch((rollbackError: unknown) => {
						console.error(
							"Failed to roll back partially created workspace user",
							{ rollbackError, userId: created.id },
						);
					});
				throw error;
			}
		});
	});

export const updateUser = authed
	.input(UpdateTenantUserInputSchema)
	.handler(async ({ context, input }) => {
		const organizationSlug = requireOrganizationSlug(context.headers);
		const organization = await getWorkspaceOrganization(
			context.headers,
			organizationSlug,
		);
		requireWorkspaceAdmin(organization, context.session, "edit users");

		const member = organization.members.find(({ id }) => id === input.id);
		if (!member) {
			throw new Error("User not found in this workspace");
		}

		const { name, role } = input.patch;
		if (name !== undefined) {
			await renameAuthUser(member.userId, name);
		}

		if (role !== undefined) {
			const { pm } = await import("#/aspen/server");
			await pm.run("$global", () =>
				pm.auth.service.api.updateMemberRole({
					body: {
						memberId: member.id,
						organizationId: organization.id,
						role,
					},
					headers: context.headers,
				}),
			);
		}

		return findWorkspaceMember(context.headers, organizationSlug, input.id);
	});

export const removeUser = authed
	.input(TenantUserIdSchema)
	.handler(async ({ context, input }) => {
		const organizationSlug = requireOrganizationSlug(context.headers);
		const organization = await getWorkspaceOrganization(
			context.headers,
			organizationSlug,
		);

		const member = organization.members.find(({ id }) => id === input.id);
		if (!member) {
			throw new Error("User not found in this workspace");
		}

		const { pm } = await import("#/aspen/server");

		return pm.run("$global", () =>
			pm.auth.service.api.removeMember({
				body: {
					memberIdOrEmail: member.id,
					organizationId: organization.id,
				},
				headers: context.headers,
			}),
		);
	});
