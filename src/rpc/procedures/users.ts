import { env } from "@/env";
import {
  CreateTenantUserSchema,
  TenantUserIdSchema,
  UpdateTenantUserInputSchema,
} from "@/schemas/users";
import { authed } from "../middlewares/auth";
import { extractSubdomain } from "./organizations";

function getOrganizationSlug(headers: Headers) {
  const host = headers.get("host");
  const organizationSlug = host
    ? extractSubdomain(host, env.PUBLIC_WEB_DOMAIN)
    : null;

  if (!organizationSlug) {
    throw new Error("This request is not associated with a workspace");
  }

  return organizationSlug;
}

function toWorkspaceUser(member: {
  createdAt: Date;
  id: string;
  role: string;
  user: { email: string; id: string; name: string };
}) {
  return {
    createdAt: member.createdAt,
    email: member.user.email,
    id: member.id,
    memberId: member.id,
    name: member.user.name,
    role: member.role,
    userId: member.user.id,
  };
}

export const listUsers = authed.handler(async ({ context }) => {
  const organizationSlug = getOrganizationSlug(context.headers);

  const { p } = await import("@/aspen/server");

  const result = await p.run("$global", () =>
    p.auth.service.api.listMembers({
      headers: context.headers,
      query: { organizationSlug },
    }),
  );

  return result.members.map(toWorkspaceUser);
});

export const getUser = authed
  .input(TenantUserIdSchema)
  .handler(async ({ context, input }) => {
    const organizationSlug = getOrganizationSlug(context.headers);

    const { p } = await import("@/aspen/server");

    const result = await p.run("$global", () =>
      p.auth.service.api.listMembers({
        headers: context.headers,
        query: { organizationSlug },
      }),
    );
    const member = result.members.find(({ id }) => id === input.id);

    if (!member) throw new Error("User not found in this workspace");

    return toWorkspaceUser(member);
  });

export const createUser = authed
  .input(CreateTenantUserSchema)
  .handler(async ({ context, input }) => {
    const organizationSlug = getOrganizationSlug(context.headers);

    const { p } = await import("@/aspen/server");

    return p.run("$global", async () => {
      const organization = await p.auth.service.api.getFullOrganization({
        headers: context.headers,
        query: { organizationSlug },
      });

      if (!organization) throw new Error("Workspace not found");

      const session = await p.auth.service.api.getSession({
        headers: context.headers,
      });
      const currentMember = organization.members.find(
        ({ user }) => user.id === session?.user.id,
      );
      if (!currentMember || !["owner", "admin"].includes(currentMember.role)) {
        throw new Error("Only workspace administrators can add users");
      }

      const created = await p.management.users.create.run({
        email: input.email,
        name: input.name,
        password: input.password,
        role: input.role === "admin" ? "tenant_admin" : "tenant_user",
        spId: null,
      });

      try {
        await p.auth.service.api.addMember({
          body: {
            organizationId: organization.id,
            role: input.role,
            userId: created.id,
          },
          headers: context.headers,
        });
      } catch (error) {
        await p.management.users.delete.run({ id: created.id });
        throw error;
      }

      return { ...created, role: input.role };
    });
  });

export const updateUser = authed
  .input(UpdateTenantUserInputSchema)
  .handler(async ({ context, input }) => {
    const organizationSlug = getOrganizationSlug(context.headers);

    const { p } = await import("@/aspen/server");

    return p.run("$global", async () => {
      const organization = await p.auth.service.api.getFullOrganization({
        headers: context.headers,
        query: { organizationSlug },
      });

      if (!organization) throw new Error("Workspace not found");

      const member = organization.members.find(({ id }) => id === input.id);
      if (!member) throw new Error("User not found in this workspace");

      const session = await p.auth.service.api.getSession({
        headers: context.headers,
      });
      const currentMember = organization.members.find(
        ({ user }) => user.id === session?.user.id,
      );
      if (!currentMember || !["owner", "admin"].includes(currentMember.role)) {
        throw new Error("Only workspace administrators can edit users");
      }

      if (input.patch.name !== undefined) {
        await p.auth._.user.update({
          data: { name: input.patch.name },
          id: member.userId,
        });
      }

      if (input.patch.role !== undefined) {
        await p.auth.service.api.updateMemberRole({
          body: {
            memberId: member.id,
            organizationId: organization.id,
            role: input.patch.role,
          },
          headers: context.headers,
        });
      }

      const updated = await p.auth.service.api.listMembers({
        headers: context.headers,
        query: { organizationSlug },
      });
      const updatedMember = updated.members.find(({ id }) => id === input.id);

      if (!updatedMember) throw new Error("User was not returned after update");

      return toWorkspaceUser(updatedMember);
    });
  });

export const removeUser = authed
  .input(TenantUserIdSchema)
  .handler(async ({ context, input }) => {
    const organizationSlug = getOrganizationSlug(context.headers);

    const { p } = await import("@/aspen/server");

    return p.run("$global", async () => {
      const organization = await p.auth.service.api.getFullOrganization({
        headers: context.headers,
        query: { organizationSlug },
      });

      if (!organization) throw new Error("Workspace not found");

      const member = organization.members.find(({ id }) => id === input.id);
      if (!member) throw new Error("User not found in this workspace");

      await p.auth.service.api.removeMember({
        body: {
          memberIdOrEmail: member.id,
          organizationId: organization.id,
        },
        headers: context.headers,
      });
    });
  });
