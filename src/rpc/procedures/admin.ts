import {
	BranchCreateSchema,
	BranchIdSchema,
	BranchPatchSchema,
	CompanySchema,
	CptListSchema,
	CptUpsertSchema,
	CptVersionSchema,
	LogsQuerySchema,
	MasterVersionSchema,
	NamedIdSchema,
	RecallRuleSchema,
	RoleIdSchema,
	RoleSchema,
	TemplateSchema,
	UserDisableSchema,
} from "#/schemas/admin";
import { authMiddleware } from "../middlewares/auth";
import { requireOrganizationSlug } from "../utils/subdomain";
import { resolveTenantDatabaseName } from "../utils/workspace-organization";

export const getCompany = authMiddleware.handler(async ({ context }) => {
	requireOrganizationSlug(context.headers);
	const dbName = await resolveTenantDatabaseName(context.headers);
	const { pm } = await import("#/aspen/server");
	try {
		return await pm.run(dbName, () =>
			pm.healthcare.admin.getCompany.run(
				{ input: {} },
				{ actorId: context.session.user.id },
			),
		);
	} catch (error) {
		throw new Error(
			`Company load failed (${error instanceof Error ? error.message : "unknown error"}); retry`,
		);
	}
});

export const saveCompany = authMiddleware
	.input(CompanySchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		try {
			return await pm.run(dbName, () =>
				pm.healthcare.admin.saveCompany.run(
					{
						input: {
							logo: input.logo,
							name: input.name,
							slug: input.slug,
						},
					},
					{ actorId: context.session.user.id },
				),
			);
		} catch (error) {
			throw new Error(
				`Company save failed (${error instanceof Error ? error.message : "unknown error"}); verify the name and retry`,
			);
		}
	});

export const listBranches = authMiddleware.handler(async ({ context }) => {
	requireOrganizationSlug(context.headers);
	const dbName = await resolveTenantDatabaseName(context.headers);
	const { pm } = await import("#/aspen/server");
	try {
		return await pm.run(dbName, () =>
			pm.healthcare.admin.listBranches.run(
				{ input: {} },
				{ actorId: context.session.user.id },
			),
		);
	} catch (error) {
		throw new Error(
			`Branch list failed (${error instanceof Error ? error.message : "unknown error"}); retry`,
		);
	}
});

export const createBranch = authMiddleware
	.input(BranchCreateSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		try {
			return await pm.run(dbName, () =>
				pm.healthcare.admin.createBranch.run(
					{
						input: {
							address: input.address,
							name: input.name,
							subdomain: input.subdomain,
						},
					},
					{ actorId: context.session.user.id },
				),
			);
		} catch (error) {
			throw new Error(
				`Branch creation failed (${error instanceof Error ? error.message : "unknown error"}); verify the subdomain and retry`,
			);
		}
	});

export const updateBranch = authMiddleware
	.input(BranchPatchSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		try {
			return await pm.run(dbName, () =>
				pm.healthcare.admin.updateBranch.run(
					{ input: { id: input.id, patch: input.patch } },
					{ actorId: context.session.user.id },
				),
			);
		} catch (error) {
			throw new Error(
				`Branch update failed (${error instanceof Error ? error.message : "unknown error"}); check the ID and retry`,
			);
		}
	});

export const disableUser = authMiddleware
	.input(UserDisableSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		try {
			return await pm.run(dbName, () =>
				pm.healthcare.staff.disableUser.run(
					{
						input: {
							branchId: input.branchId,
							reason: input.reason ?? "Disabled from clinic admin",
							staffId: input.id,
							status: "exited",
						},
					},
					{ actorId: context.session.user.id },
				),
			);
		} catch (error) {
			throw new Error(
				`User disable failed (${error instanceof Error ? error.message : "unknown error"}); check the user ID and retry`,
			);
		}
	});

export const listRoles = authMiddleware.handler(async ({ context }) => {
	requireOrganizationSlug(context.headers);
	const dbName = await resolveTenantDatabaseName(context.headers);
	const { pm } = await import("#/aspen/server");
	try {
		return await pm.run(dbName, () =>
			pm.healthcare.staff.listRoles.run(
				{ input: { branchId: "main" } },
				{ actorId: context.session.user.id },
			),
		);
	} catch (error) {
		throw new Error(
			`Role list failed (${error instanceof Error ? error.message : "unknown error"}); retry`,
		);
	}
});

export const createRole = authMiddleware
	.input(RoleSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		try {
			return await pm.run(dbName, () =>
				pm.healthcare.staff.createRole.run(
					{
						input: {
							branchId: input.branchId,
							name: input.name,
							permissions: input.permissions,
						},
					},
					{ actorId: context.session.user.id },
				),
			);
		} catch (error) {
			throw new Error(
				`Role creation failed (${error instanceof Error ? error.message : "unknown error"}); verify the name and retry`,
			);
		}
	});

export const deleteRole = authMiddleware
	.input(RoleIdSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		try {
			return await pm.run(dbName, () =>
				pm.healthcare.staff.deleteRole.run(
					{ input: { branchId: "main", id: input.id } },
					{ actorId: context.session.user.id },
				),
			);
		} catch (error) {
			throw new Error(
				`Role deletion failed (${error instanceof Error ? error.message : "unknown error"}); check the ID and retry`,
			);
		}
	});

export const listMasterVersions = authMiddleware.handler(
	async ({ context }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		try {
			return await pm.run(dbName, () =>
				pm.healthcare.admin.listMasterVersions.run(
					{ input: {} },
					{ actorId: context.session.user.id },
				),
			);
		} catch (error) {
			throw new Error(
				`Master list failed (${error instanceof Error ? error.message : "unknown error"}); retry`,
			);
		}
	},
);

export const saveMasterVersion = authMiddleware
	.input(MasterVersionSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		try {
			return await pm.run(dbName, () =>
				pm.healthcare.admin.saveMasterVersion.run(
					{
						input: {
							branchId: input.branchId,
							domain: input.domain,
							payload: input.payload,
							version: input.version,
						},
					},
					{ actorId: context.session.user.id },
				),
			);
		} catch (error) {
			throw new Error(
				`Master save failed (${error instanceof Error ? error.message : "unknown error"}); verify domain/version and retry`,
			);
		}
	});

export const listTemplates = authMiddleware.handler(async ({ context }) => {
	requireOrganizationSlug(context.headers);
	const dbName = await resolveTenantDatabaseName(context.headers);
	const { pm } = await import("#/aspen/server");
	try {
		return await pm.run(dbName, () =>
			pm.healthcare.admin.listTemplates.run(
				{ input: {} },
				{ actorId: context.session.user.id },
			),
		);
	} catch (error) {
		throw new Error(
			`Template list failed (${error instanceof Error ? error.message : "unknown error"}); retry`,
		);
	}
});

export const saveTemplate = authMiddleware
	.input(TemplateSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		try {
			// status (draft/approved/retired) is validated locally for the
			// send-gate; the backend save-template stores body/kind/name only
			// until its schema grows a status column.
			return await pm.run(dbName, () =>
				pm.healthcare.admin.saveTemplate.run(
					{
						input: {
							body: input.body,
							branchId: input.branchId,
							kind: input.kind,
							name: input.name,
						},
					},
					{ actorId: context.session.user.id },
				),
			);
		} catch (error) {
			throw new Error(
				`Template save failed (${error instanceof Error ? error.message : "unknown error"}); verify the body and retry`,
			);
		}
	});

export const deleteTemplate = authMiddleware
	.input(NamedIdSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		try {
			return await pm.run(dbName, () =>
				pm.healthcare.admin.deleteTemplate.run(
					{ input: { id: input.id } },
					{ actorId: context.session.user.id },
				),
			);
		} catch (error) {
			throw new Error(
				`Template deletion failed (${error instanceof Error ? error.message : "unknown error"}); check the ID and retry`,
			);
		}
	});

export const listRecallRules = authMiddleware.handler(async ({ context }) => {
	requireOrganizationSlug(context.headers);
	const dbName = await resolveTenantDatabaseName(context.headers);
	const { pm } = await import("#/aspen/server");
	try {
		return await pm.run(dbName, () =>
			pm.healthcare.admin.listRecallRules.run(
				{ input: {} },
				{ actorId: context.session.user.id },
			),
		);
	} catch (error) {
		throw new Error(
			`Recall-rule list failed (${error instanceof Error ? error.message : "unknown error"}); retry`,
		);
	}
});

export const saveRecallRule = authMiddleware
	.input(RecallRuleSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		try {
			return await pm.run(dbName, () =>
				pm.healthcare.admin.saveRecallRule.run(
					{
						input: {
							branchId: input.branchId,
							daysAfter: input.daysAfter,
							message: input.message,
							name: input.name,
						},
					},
					{ actorId: context.session.user.id },
				),
			);
		} catch (error) {
			throw new Error(
				`Recall-rule save failed (${error instanceof Error ? error.message : "unknown error"}); verify the rule and retry`,
			);
		}
	});

export const deleteRecallRule = authMiddleware
	.input(BranchIdSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		try {
			return await pm.run(dbName, () =>
				pm.healthcare.admin.deleteRecallRule.run(
					{ input: { id: input.id } },
					{ actorId: context.session.user.id },
				),
			);
		} catch (error) {
			throw new Error(
				`Recall-rule deletion failed (${error instanceof Error ? error.message : "unknown error"}); check the ID and retry`,
			);
		}
	});

export const logs = authMiddleware
	.input(LogsQuerySchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		try {
			return await pm.run(dbName, () =>
				pm.healthcare.admin.logs.run(
					{
						input: {
							branchId: input.branchId,
							limit: input.limit,
						},
					},
					{ actorId: context.session.user.id },
				),
			);
		} catch (error) {
			throw new Error(
				`Audit log load failed (${error instanceof Error ? error.message : "unknown error"}); retry`,
			);
		}
	});

// CPT + billing-code master (P0-5, admin domain). Backed by the generic
// master-version store with domain "cpt": version = CPT code, payload = JSON
// of { code, description, billingCode, system, price }.
export const upsertCptCode = authMiddleware
	.input(CptUpsertSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		try {
			return await pm.run(dbName, () =>
				pm.healthcare.admin.saveMasterVersion.run(
					{
						input: {
							branchId: input.branchId,
							domain: "cpt",
							payload: JSON.stringify({
								billingCode: input.billingCode,
								code: input.code,
								description: input.description,
								price: input.price,
								system: input.system,
							}),
							version: input.code,
						},
					},
					{ actorId: context.session.user.id },
				),
			);
		} catch (error) {
			throw new Error(
				`CPT save failed (${error instanceof Error ? error.message : "unknown error"}); verify the code and retry`,
			);
		}
	});

export const listCptCodes = authMiddleware
	.input(CptListSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		try {
			const rows = (await pm.run(dbName, () =>
				pm.healthcare.admin.listMasterVersions.run(
					{ input: {} },
					{ actorId: context.session.user.id },
				),
			)) as Array<{
				branchId?: string;
				domain?: string;
				payload?: string | null;
				version?: string;
			}>;
			const q = (input.search ?? "").trim().toLowerCase();
			return rows
				.filter((r) => r.domain === "cpt")
				.map((r) => {
					try {
						return {
							...JSON.parse(r.payload ?? "{}"),
							version: r.version,
						};
					} catch {
						return { code: r.version, version: r.version };
					}
				})
				.filter((c: { code?: string; description?: string }) => {
					if (!q) return true;
					return (
						(c.code ?? "").toLowerCase().includes(q) ||
						(c.description ?? "").toLowerCase().includes(q)
					);
				});
		} catch (error) {
			throw new Error(
				`CPT list failed (${error instanceof Error ? error.message : "unknown error"}); retry`,
			);
		}
	});

export const saveCptVersion = authMiddleware
	.input(CptVersionSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		try {
			return await pm.run(dbName, () =>
				pm.healthcare.admin.saveMasterVersion.run(
					{
						input: {
							branchId: input.branchId,
							domain: "cpt",
							payload: input.payload,
							version: input.version,
						},
					},
					{ actorId: context.session.user.id },
				),
			);
		} catch (error) {
			throw new Error(
				`CPT version save failed (${error instanceof Error ? error.message : "unknown error"}); verify the version and retry`,
			);
		}
	});
