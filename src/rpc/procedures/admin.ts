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
import { scopedAuthMiddleware } from "../middlewares/scoped_auth";

export const getCompany = scopedAuthMiddleware.handler(async ({ context }) => {
	const { actorId, pm, tenantId } = context;
	try {
		return await pm.run(tenantId, () =>
			pm.healthcare.admin.getCompany.run({ input: {} }, { actorId }),
		);
	} catch (error) {
		throw new Error(
			`Company load failed (${error instanceof Error ? error.message : "unknown error"}); retry`,
		);
	}
});

export const saveCompany = scopedAuthMiddleware
	.input(CompanySchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.admin.saveCompany.run(
					{
						input: {
							logo: input.logo,
							name: input.name,
							slug: input.slug,
						},
					},
					{ actorId },
				),
			);
		} catch (error) {
			throw new Error(
				`Company save failed (${error instanceof Error ? error.message : "unknown error"}); verify the name and retry`,
			);
		}
	});

export const listBranches = scopedAuthMiddleware.handler(
	async ({ context }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.admin.listBranches.run({ input: {} }, { actorId }),
			);
		} catch (error) {
			throw new Error(
				`Branch list failed (${error instanceof Error ? error.message : "unknown error"}); retry`,
			);
		}
	},
);

export const createBranch = scopedAuthMiddleware
	.input(BranchCreateSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.admin.createBranch.run(
					{
						input: {
							address: input.address,
							name: input.name,
							subdomain: input.subdomain,
						},
					},
					{ actorId },
				),
			);
		} catch (error) {
			throw new Error(
				`Branch creation failed (${error instanceof Error ? error.message : "unknown error"}); verify the subdomain and retry`,
			);
		}
	});

export const updateBranch = scopedAuthMiddleware
	.input(BranchPatchSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.admin.updateBranch.run(
					{ input: { id: input.id, patch: input.patch } },
					{ actorId },
				),
			);
		} catch (error) {
			throw new Error(
				`Branch update failed (${error instanceof Error ? error.message : "unknown error"}); check the ID and retry`,
			);
		}
	});

export const disableUser = scopedAuthMiddleware
	.input(UserDisableSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.staff.disableUser.run(
					{
						input: {
							branchId: input.branchId,
							reason: input.reason ?? "Disabled from clinic admin",
							staffId: input.id,
							status: "exited",
						},
					},
					{ actorId },
				),
			);
		} catch (error) {
			throw new Error(
				`User disable failed (${error instanceof Error ? error.message : "unknown error"}); check the user ID and retry`,
			);
		}
	});

export const listRoles = scopedAuthMiddleware.handler(async ({ context }) => {
	const { actorId, pm, tenantId } = context;
	try {
		return await pm.run(tenantId, () =>
			pm.healthcare.staff.listRoles.run(
				{ input: { branchId: "main" } },
				{ actorId },
			),
		);
	} catch (error) {
		throw new Error(
			`Role list failed (${error instanceof Error ? error.message : "unknown error"}); retry`,
		);
	}
});

export const createRole = scopedAuthMiddleware
	.input(RoleSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.staff.createRole.run(
					{
						input: {
							branchId: input.branchId,
							name: input.name,
							permissions: input.permissions,
						},
					},
					{ actorId },
				),
			);
		} catch (error) {
			throw new Error(
				`Role creation failed (${error instanceof Error ? error.message : "unknown error"}); verify the name and retry`,
			);
		}
	});

export const deleteRole = scopedAuthMiddleware
	.input(RoleIdSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.staff.deleteRole.run(
					{ input: { branchId: "main", id: input.id } },
					{ actorId },
				),
			);
		} catch (error) {
			throw new Error(
				`Role deletion failed (${error instanceof Error ? error.message : "unknown error"}); check the ID and retry`,
			);
		}
	});

export const listMasterVersions = scopedAuthMiddleware.handler(
	async ({ context }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.admin.listMasterVersions.run({ input: {} }, { actorId }),
			);
		} catch (error) {
			throw new Error(
				`Master list failed (${error instanceof Error ? error.message : "unknown error"}); retry`,
			);
		}
	},
);

export const saveMasterVersion = scopedAuthMiddleware
	.input(MasterVersionSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.admin.saveMasterVersion.run(
					{
						input: {
							branchId: input.branchId,
							domain: input.domain,
							payload: input.payload,
							version: input.version,
						},
					},
					{ actorId },
				),
			);
		} catch (error) {
			throw new Error(
				`Master save failed (${error instanceof Error ? error.message : "unknown error"}); verify domain/version and retry`,
			);
		}
	});

export const listTemplates = scopedAuthMiddleware.handler(
	async ({ context }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.admin.listTemplates.run({ input: {} }, { actorId }),
			);
		} catch (error) {
			throw new Error(
				`Template list failed (${error instanceof Error ? error.message : "unknown error"}); retry`,
			);
		}
	},
);

export const saveTemplate = scopedAuthMiddleware
	.input(TemplateSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			// status (draft/approved/retired) is validated locally for the
			// send-gate; the backend save-template stores body/kind/name only
			// until its schema grows a status column.
			return await pm.run(tenantId, () =>
				pm.healthcare.admin.saveTemplate.run(
					{
						input: {
							body: input.body,
							branchId: input.branchId,
							kind: input.kind,
							name: input.name,
						},
					},
					{ actorId },
				),
			);
		} catch (error) {
			throw new Error(
				`Template save failed (${error instanceof Error ? error.message : "unknown error"}); verify the body and retry`,
			);
		}
	});

export const deleteTemplate = scopedAuthMiddleware
	.input(NamedIdSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.admin.deleteTemplate.run(
					{ input: { id: input.id } },
					{ actorId },
				),
			);
		} catch (error) {
			throw new Error(
				`Template deletion failed (${error instanceof Error ? error.message : "unknown error"}); check the ID and retry`,
			);
		}
	});

export const listRecallRules = scopedAuthMiddleware.handler(
	async ({ context }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.admin.listRecallRules.run({ input: {} }, { actorId }),
			);
		} catch (error) {
			throw new Error(
				`Recall-rule list failed (${error instanceof Error ? error.message : "unknown error"}); retry`,
			);
		}
	},
);

export const saveRecallRule = scopedAuthMiddleware
	.input(RecallRuleSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.admin.saveRecallRule.run(
					{
						input: {
							branchId: input.branchId,
							daysAfter: input.daysAfter,
							message: input.message,
							name: input.name,
						},
					},
					{ actorId },
				),
			);
		} catch (error) {
			throw new Error(
				`Recall-rule save failed (${error instanceof Error ? error.message : "unknown error"}); verify the rule and retry`,
			);
		}
	});

export const deleteRecallRule = scopedAuthMiddleware
	.input(BranchIdSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.admin.deleteRecallRule.run(
					{ input: { id: input.id } },
					{ actorId },
				),
			);
		} catch (error) {
			throw new Error(
				`Recall-rule deletion failed (${error instanceof Error ? error.message : "unknown error"}); check the ID and retry`,
			);
		}
	});

export const logs = scopedAuthMiddleware
	.input(LogsQuerySchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.admin.logs.run(
					{
						input: {
							branchId: input.branchId,
							limit: input.limit,
						},
					},
					{ actorId },
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
export const upsertCptCode = scopedAuthMiddleware
	.input(CptUpsertSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
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
					{ actorId },
				),
			);
		} catch (error) {
			throw new Error(
				`CPT save failed (${error instanceof Error ? error.message : "unknown error"}); verify the code and retry`,
			);
		}
	});

export const listCptCodes = scopedAuthMiddleware
	.input(CptListSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			const rows = (await pm.run(tenantId, () =>
				pm.healthcare.admin.listMasterVersions.run({ input: {} }, { actorId }),
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

export const saveCptVersion = scopedAuthMiddleware
	.input(CptVersionSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.admin.saveMasterVersion.run(
					{
						input: {
							branchId: input.branchId,
							domain: "cpt",
							payload: input.payload,
							version: input.version,
						},
					},
					{ actorId },
				),
			);
		} catch (error) {
			throw new Error(
				`CPT version save failed (${error instanceof Error ? error.message : "unknown error"}); verify the version and retry`,
			);
		}
	});
