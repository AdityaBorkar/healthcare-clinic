import { minLength, object, optional, picklist, pipe, string } from "valibot";

const BranchId = optional(string(), "main");
const Id = pipe(string(), minLength(1, "ID is required"));

export const DocumentAttachSchema = object({
	branchId: BranchId,
	encounterId: optional(string()),
	filePath: pipe(string(), minLength(1, "File path is required")),
	fileType: pipe(string(), minLength(1, "File type is required")),
	label: optional(string()),
	patientId: Id,
	uploadedBy: Id,
});

export const ShareSchema = object({
	branchId: BranchId,
	channel: picklist(["print", "whatsapp", "email"]),
	docId: optional(string()),
	patientId: optional(string()),
	recipient: pipe(string(), minLength(1, "Recipient is required")),
	recipientConfirm: picklist(["yes", "no"]),
	sharedBy: Id,
});

export const AddendumSchema = object({
	authorId: Id,
	branchId: BranchId,
	encounterId: Id,
	note: pipe(string(), minLength(1, "Addendum note is required")),
});

export const BreakGlassSchema = object({
	accessedBy: Id,
	branchId: BranchId,
	patientId: Id,
	reason: pipe(string(), minLength(1, "Break-glass reason is required")),
});

export const RegisterEntrySchema = object({
	branchId: BranchId,
	details: pipe(string(), minLength(1, "Entry details are required")),
	enteredBy: Id,
	register: picklist([
		"opd",
		"lab",
		"radio",
		"pharmacy",
		"birth",
		"death",
		"mlc",
		"referral",
	]),
});

export const RegisterVoidSchema = object({
	branchId: BranchId,
	entryId: Id,
	reason: pipe(string(), minLength(1, "Void reason is required")),
	voidedBy: Id,
});

export const MergeSchema = object({
	branchId: BranchId,
	duplicateId: Id,
	mergedBy: Id,
	primaryId: Id,
});

export const RetentionCheckSchema = object({
	branchId: BranchId,
	patientId: optional(string()),
});

export const TimelineQuerySchema = object({
	branchId: BranchId,
	patientId: Id,
});

export const EncounterGetSchema = object({
	branchId: BranchId,
	encounterId: Id,
});

export const RecordsSearchSchema = object({
	branchId: BranchId,
	q: pipe(string(), minLength(1, "Search text is required")),
});

export const ConsentsGetSchema = object({
	branchId: BranchId,
	patientId: Id,
});

export const DischargeIssueSchema = object({
	branchId: BranchId,
	encounterId: Id,
	issuedBy: Id,
	summary: pipe(string(), minLength(1, "Discharge summary is required")),
});

export const RecordsIdSchema = object({
	branchId: BranchId,
	id: Id,
});
