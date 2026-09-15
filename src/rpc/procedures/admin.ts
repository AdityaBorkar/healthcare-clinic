import {
	AuditLogsQuerySchema,
	BranchFiltersSchema,
	BranchIdSchema,
	CreateBranchSchema,
	CreateRoleSchema,
	DisableUserSchema,
	MasterVersionFiltersSchema,
	RecallRuleFiltersSchema,
	RecallRuleIdSchema,
	RoleFiltersSchema,
	RoleIdSchema,
	SaveCompanySchema,
	SaveMasterVersionSchema,
	SaveRecallRuleSchema,
	SaveTemplateSchema,
	TemplateFiltersSchema,
	TemplateIdSchema,
	UpdateBranchSchema,
} from "@aspen-os/healthcare";
import {
	minLength,
	number,
	object,
	optional,
	picklist,
	pipe,
	string,
} from "valibot";

import { scopedAuthMiddleware } from "../middlewares/scoped_auth";

// CPT + billing-code master (P0-5, admin domain). Backed by the generic
// master-version store with domain "cpt": version = CPT code, payload = JSON
// of { code, description, billingCode, system, price }. Aspen has no CPT
// concept, so these three schemas are custom to this module (form validation
// for the CPT section in admin/services.tsx) and defined here, not in Aspen.
const BillingCodeSystemSchema = picklist(["CPT", "ICD-11", "internal"]);

export const CptUpsertSchema = object({
	billingCode: pipe(string(), minLength(1, "Billing code is required")),
	branchId: BranchIdSchema,
	code: pipe(string(), minLength(1, "CPT code is required")),
	description: pipe(string(), minLength(1, "Description is required")),
	price: optional(number()),
	system: optional(BillingCodeSystemSchema, "CPT"),
});

export const CptListSchema = object({
	branchId: BranchIdSchema,
	search: optional(string()),
});

export const CptVersionSchema = object({
	branchId: BranchIdSchema,
	payload: optional(string()),
	version: pipe(string(), minLength(1, "Version is required")),
});

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
	.input(SaveCompanySchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.admin.saveCompany.run({ input }, { actorId }),
			);
		} catch (error) {
			throw new Error(
				`Company save failed (${error instanceof Error ? error.message : "unknown error"}); verify the name and retry`,
			);
		}
	});

export const listBranches = scopedAuthMiddleware
	.input(BranchFiltersSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.admin.listBranches.run({ input }, { actorId }),
			);
		} catch (error) {
			throw new Error(
				`Branch list failed (${error instanceof Error ? error.message : "unknown error"}); retry`,
			);
		}
	});

export const createBranch = scopedAuthMiddleware
	.input(CreateBranchSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.admin.createBranch.run({ input }, { actorId }),
			);
		} catch (error) {
			throw new Error(
				`Branch creation failed (${error instanceof Error ? error.message : "unknown error"}); verify the subdomain and retry`,
			);
		}
	});

export const updateBranch = scopedAuthMiddleware
	.input(UpdateBranchSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.admin.updateBranch.run({ input }, { actorId }),
			);
		} catch (error) {
			throw new Error(
				`Branch update failed (${error instanceof Error ? error.message : "unknown error"}); check the ID and retry`,
			);
		}
	});

export const disableUser = scopedAuthMiddleware
	.input(DisableUserSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.staff.disableUser.run({ input }, { actorId }),
			);
		} catch (error) {
			throw new Error(
				`User disable failed (${error instanceof Error ? error.message : "unknown error"}); check the user ID and retry`,
			);
		}
	});

export const listRoles = scopedAuthMiddleware
	.input(RoleFiltersSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.staff.listRoles.run({ input }, { actorId }),
			);
		} catch (error) {
			throw new Error(
				`Role list failed (${error instanceof Error ? error.message : "unknown error"}); retry`,
			);
		}
	});

export const createRole = scopedAuthMiddleware
	.input(CreateRoleSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.staff.createRole.run({ input }, { actorId }),
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
				pm.healthcare.staff.deleteRole.run({ input }, { actorId }),
			);
		} catch (error) {
			throw new Error(
				`Role deletion failed (${error instanceof Error ? error.message : "unknown error"}); check the ID and retry`,
			);
		}
	});

export const listMasterVersions = scopedAuthMiddleware
	.input(MasterVersionFiltersSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.admin.listMasterVersions.run({ input }, { actorId }),
			);
		} catch (error) {
			throw new Error(
				`Master list failed (${error instanceof Error ? error.message : "unknown error"}); retry`,
			);
		}
	});

export const saveMasterVersion = scopedAuthMiddleware
	.input(SaveMasterVersionSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.admin.saveMasterVersion.run({ input }, { actorId }),
			);
		} catch (error) {
			throw new Error(
				`Master save failed (${error instanceof Error ? error.message : "unknown error"}); verify domain/version and retry`,
			);
		}
	});

export const listTemplates = scopedAuthMiddleware
	.input(TemplateFiltersSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.admin.listTemplates.run({ input }, { actorId }),
			);
		} catch (error) {
			throw new Error(
				`Template list failed (${error instanceof Error ? error.message : "unknown error"}); retry`,
			);
		}
	});

export const saveTemplate = scopedAuthMiddleware
	.input(SaveTemplateSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			// status (draft/approved/retired) is validated locally for the
			// send-gate; the backend save-template stores body/kind/name only
			// until its schema grows a status column.
			return await pm.run(tenantId, () =>
				pm.healthcare.admin.saveTemplate.run({ input }, { actorId }),
			);
		} catch (error) {
			throw new Error(
				`Template save failed (${error instanceof Error ? error.message : "unknown error"}); verify the body and retry`,
			);
		}
	});

export const deleteTemplate = scopedAuthMiddleware
	.input(TemplateIdSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.admin.deleteTemplate.run({ input }, { actorId }),
			);
		} catch (error) {
			throw new Error(
				`Template deletion failed (${error instanceof Error ? error.message : "unknown error"}); check the ID and retry`,
			);
		}
	});

export const listRecallRules = scopedAuthMiddleware
	.input(RecallRuleFiltersSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.admin.listRecallRules.run({ input }, { actorId }),
			);
		} catch (error) {
			throw new Error(
				`Recall-rule list failed (${error instanceof Error ? error.message : "unknown error"}); retry`,
			);
		}
	});

export const saveRecallRule = scopedAuthMiddleware
	.input(SaveRecallRuleSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.admin.saveRecallRule.run({ input }, { actorId }),
			);
		} catch (error) {
			throw new Error(
				`Recall-rule save failed (${error instanceof Error ? error.message : "unknown error"}); verify the rule and retry`,
			);
		}
	});

export const deleteRecallRule = scopedAuthMiddleware
	.input(RecallRuleIdSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.admin.deleteRecallRule.run({ input }, { actorId }),
			);
		} catch (error) {
			throw new Error(
				`Recall-rule deletion failed (${error instanceof Error ? error.message : "unknown error"}); check the ID and retry`,
			);
		}
	});

export const logs = scopedAuthMiddleware
	.input(AuditLogsQuerySchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.admin.logs.run({ input }, { actorId }),
			);
		} catch (error) {
			throw new Error(
				`Audit log load failed (${error instanceof Error ? error.message : "unknown error"}); retry`,
			);
		}
	});

// CPT + billing-code master (P0-5, admin domain). Backed by the generic
// master-version store with domain "cpt": version = CPT code, payload = JSON
// of { code, description, billingCode, system, price }. Aspen has no CPT
// concept, so these three procedures use the custom schemas defined above
// in this module.
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
