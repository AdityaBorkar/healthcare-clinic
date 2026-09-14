import {
	array,
	minLength,
	number,
	object,
	optional,
	picklist,
	pipe,
	string,
} from "valibot";

const BranchId = optional(string(), "main");
const Id = pipe(string(), minLength(1, "ID is required"));

export const StaffUpsertSchema = object({
	branchId: BranchId,
	department: optional(string()),
	doj: optional(string()),
	exitDate: optional(string()),
	name: pipe(string(), minLength(1, "Name is required")),
	phone: optional(string()),
	role: pipe(string(), minLength(1, "Role is required")),
	staffId: optional(string()),
	status: optional(picklist(["active", "on-notice", "exited"])),
});

export const RosterPlanSchema = object({
	branchId: BranchId,
	entries: array(
		object({
			date: pipe(string(), minLength(1)),
			shift: picklist(["morning", "evening", "night", "off"]),
			staffId: Id,
		}),
	),
	month: pipe(string(), minLength(1, "Month is required")),
});

export const AttendanceMarkSchema = object({
	branchId: BranchId,
	date: pipe(string(), minLength(1, "Date is required")),
	staffId: Id,
	status: picklist(["present", "absent", "leave", "half"]),
});

export const LeaveRequestSchema = object({
	branchId: BranchId,
	from: pipe(string(), minLength(1, "From date is required")),
	reason: pipe(string(), minLength(1, "Reason is required")),
	staffId: Id,
	to: pipe(string(), minLength(1, "To date is required")),
});

export const LeaveDecideSchema = object({
	branchId: BranchId,
	decidedBy: Id,
	decision: picklist(["approve", "reject"]),
	leaveId: Id,
});

export const PayrollExportSchema = object({
	branchId: BranchId,
	month: pipe(string(), minLength(1, "Month is required")),
});

export const BranchCreateSchema = object({
	address: optional(string()),
	name: pipe(string(), minLength(1, "Branch name is required")),
	slug: optional(string()),
});

export const SeedPresetsSchema = object({
	branchId: BranchId,
	preset: picklist([
		"pricelist",
		"tests",
		"masters",
		"facilities",
		"facility-mri",
		"facility-ct",
		"facility-xray",
		"facility-usg",
		"facility-therapy",
	]),
});

export const MasterUpsertSchema = object({
	branchId: BranchId,
	domain: pipe(string(), minLength(1, "Master domain is required")),
	key: pipe(string(), minLength(1, "Key is required")),
	value: string(),
});

export const ReportDefSchema = object({
	branchId: BranchId,
	collection: pipe(string(), minLength(1, "Collection is required")),
	filters: optional(string()),
	name: pipe(string(), minLength(1, "Report name is required")),
});

export const ReportRunSchema = object({
	branchId: BranchId,
	limit: optional(number()),
	reportId: Id,
});

export const ComplianceEvidenceSchema = object({
	attestedBy: optional(string()),
	branchId: BranchId,
	control: pipe(string(), minLength(1, "Control reference is required")),
	evidencePath: pipe(string(), minLength(1, "Evidence path is required")),
	framework: picklist(["CEA", "NABH", "NABL"]),
});

export const MessageSendSchema = object({
	branchId: BranchId,
	channel: optional(picklist(["sms", "whatsapp"])),
	patientId: optional(string()),
	template: pipe(string(), minLength(1, "Template is required")),
	to: pipe(string(), minLength(1, "Recipient is required")),
});

export const MessageRetrySchema = object({
	branchId: BranchId,
	messageId: Id,
});

export const OptOutSchema = object({
	branchId: BranchId,
	channel: optional(picklist(["sms", "whatsapp"])),
	to: pipe(string(), minLength(1, "Recipient is required")),
});

export const ExplorerGrantSchema = object({
	branchId: BranchId,
	expiresAt: optional(string()),
	granteeId: Id,
	scope: pipe(string(), minLength(1, "Scope is required")),
});

export const ExplorerQuerySchema = object({
	branchId: BranchId,
	collection: pipe(string(), minLength(1, "Collection is required")),
	filters: optional(string()),
	limit: optional(number()),
	offset: optional(number()),
	sort: optional(string()),
});

export const MasterFilterSchema = object({
	branchId: BranchId,
	domain: optional(string()),
});

export const ComplianceListSchema = object({
	branchId: BranchId,
	framework: optional(picklist(["CEA", "NABH", "NABL"])),
});

export const ReportListSchema = object({
	branchId: BranchId,
	collection: optional(string()),
});

export const OperationsIdSchema = object({
	branchId: BranchId,
	id: Id,
});
