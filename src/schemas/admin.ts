import {
	array,
	integer,
	minLength,
	minValue,
	number,
	object,
	optional,
	picklist,
	pipe,
	string,
} from "valibot";

import { NameSchema, SlugSchema } from "#/schemas/common";

const BranchId = optional(string(), "main");

export const CompanySchema = object({
	logo: optional(string()),
	name: NameSchema,
	slug: optional(SlugSchema),
});

export const BranchCreateSchema = object({
	address: optional(string()),
	name: NameSchema,
	subdomain: SlugSchema,
});

export const BranchIdSchema = object({
	id: pipe(string(), minLength(1, "Branch ID is required")),
});

export const BranchPatchSchema = object({
	id: pipe(string(), minLength(1, "Branch ID is required")),
	patch: object({
		address: optional(string()),
		name: optional(NameSchema),
	}),
});

export const UserDisableSchema = object({
	branchId: BranchId,
	id: pipe(string(), minLength(1, "User ID is required")),
	reason: optional(string()),
});

export const RoleSchema = object({
	branchId: BranchId,
	name: NameSchema,
	permissions: array(pipe(string(), minLength(1))),
});

export const RoleIdSchema = object({
	id: pipe(string(), minLength(1, "Role ID is required")),
});

export const MasterVersionSchema = object({
	branchId: BranchId,
	domain: pipe(string(), minLength(1, "Domain is required")),
	payload: optional(string()),
	version: pipe(string(), minLength(1, "Version is required")),
});

export const TemplateStatusSchema = picklist(["draft", "approved", "retired"]);

export const TemplateSchema = object({
	body: pipe(string(), minLength(1, "Template body is required")),
	branchId: BranchId,
	kind: pipe(string(), minLength(1, "Template kind is required")),
	name: NameSchema,
	// Approval lifecycle (P0-3): new templates start as draft; only
	// approved templates may be sent (send-gate enforced by operations'
	// messaging procedure). Retired templates are kept for audit.
	status: optional(TemplateStatusSchema, "draft"),
});

export const TemplateApproveSchema = object({
	id: pipe(string(), minLength(1, "Template ID is required")),
	status: TemplateStatusSchema,
});

export const RecallRuleSchema = object({
	branchId: BranchId,
	daysAfter: number(),
	message: pipe(string(), minLength(1, "Recall message is required")),
	name: NameSchema,
});

export const LogsQuerySchema = object({
	branchId: optional(string()),
	limit: optional(number(), 100),
});

export const NamedIdSchema = object({
	id: pipe(string(), minLength(1, "ID is required")),
});

// CPT + billing-code master (P0-5, admin domain). Stored via the generic
// master-version store with domain "cpt" so no new Aspen workflow is needed;
// invoices must carry >= 1 code (see INVOICE_MIN_CODES_NOTE).
export const BillingCodeSystemSchema = picklist(["CPT", "ICD-11", "internal"]);

export const CptCodeSchema = object({
	billingCode: pipe(string(), minLength(1, "Billing code is required")),
	code: pipe(string(), minLength(1, "CPT code is required")),
	description: pipe(string(), minLength(1, "Description is required")),
	price: optional(number()),
	system: optional(BillingCodeSystemSchema, "CPT"),
});

export const CptUpsertSchema = object({
	billingCode: pipe(string(), minLength(1, "Billing code is required")),
	branchId: BranchId,
	code: pipe(string(), minLength(1, "CPT code is required")),
	description: pipe(string(), minLength(1, "Description is required")),
	price: optional(number()),
	system: optional(BillingCodeSystemSchema, "CPT"),
});

export const CptListSchema = object({
	branchId: BranchId,
	search: optional(string()),
});

export const CptVersionSchema = object({
	branchId: BranchId,
	// Master-version payload is a JSON string of CptCodeSchema[].
	payload: optional(string()),
	version: pipe(string(), minLength(1, "Version is required")),
});

export const INVOICE_MIN_CODES_NOTE =
	"Every invoice must carry at least one billing code (CPT/ICD-11/internal).";

export const PositiveInt = pipe(number(), integer(), minValue(1));
