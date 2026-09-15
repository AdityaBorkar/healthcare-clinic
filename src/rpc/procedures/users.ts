import { NameSchema } from "@aspen-os/platform/server";
import {
	email,
	minLength,
	object,
	optional,
	picklist,
	pipe,
	string,
} from "valibot";

import { authMiddleware } from "../middlewares/auth";
import { requireOrganizationSlug } from "../utils/subdomain";
import {
	findWorkspaceMember,
	toWorkspaceUser,
} from "../utils/workspace-members";
import {
	getWorkspaceOrganization,
	renameAuthUser,
	requireWorkspaceAdmin,
} from "../utils/workspace-organization";

// Workspace user management is custom to this module (no Aspen equivalent
// for workspace roles admin|member + password policy + auth/workspace
// orchestration). Schemas are defined here for the user forms in
// settings/users/; other domains use their Aspen module schemas.
export const OrganizationUserRoleSchema = picklist(["admin", "member"]);

const PasswordSchema = pipe(
	string(),
	minLength(8, "Password must be at least 8 characters"),
);

export const CreateTenantUserSchema = object({
	email: pipe(string(), email("Enter a valid email address")),
	name: NameSchema,
	password: PasswordSchema,
	role: OrganizationUserRoleSchema,
});

const UpdateTenantUserSchema = object({
	name: optional(NameSchema),
	role: optional(OrganizationUserRoleSchema),
});

export const TenantUserIdSchema = object({
	id: pipe(string(), minLength(1, "User ID is required")),
});

export const UpdateTenantUserInputSchema = object({
	id: pipe(string(), minLength(1, "User ID is required")),
	patch: UpdateTenantUserSchema,
});

export const listUsers = authMiddleware.handler(async ({ context }) => {
	const headers = context.headers;
	const organizationSlug = requireOrganizationSlug(headers);

	const { pm } = await import("#/aspen/server");
	const result = await pm.run("$global", () =>
		pm.auth.service.api.listMembers({
			headers,
			query: { organizationSlug },
		}),
	);
	return result.members.map(toWorkspaceUser);
});

export const getUser = authMiddleware
	.input(TenantUserIdSchema)
	.handler(async ({ context, input }) => {
		const organizationSlug = requireOrganizationSlug(context.headers);
		return findWorkspaceMember(context.headers, organizationSlug, input.id);
	});

export const createUser = authMiddleware
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

export const updateUser = authMiddleware
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

export const removeUser = authMiddleware
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
