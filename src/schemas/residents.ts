import {
	array,
	maxValue,
	minLength,
	minValue,
	number,
	object,
	optional,
	picklist,
	pipe,
	string,
} from "valibot";

const BranchId = optional(string(), "main");
const Id = pipe(string(), minLength(1, "ID is required"));

export const ResidentAdmitSchema = object({
	address: optional(string()),
	advance: pipe(number(), minValue(0, "Advance cannot be negative")),
	age: pipe(number(), minValue(0), maxValue(130)),
	branchId: BranchId,
	name: pipe(string(), minLength(1, "Name is required")),
	nokName: pipe(string(), minLength(1, "Next-of-kin name is required")),
	nokPhone: pipe(string(), minLength(1, "Next-of-kin phone is required")),
	phone: pipe(string(), minLength(1, "Phone is required")),
	roomType: optional(string()),
	sex: picklist(["male", "female", "other"]),
});

export const BedAllocateSchema = object({
	bedId: Id,
	branchId: BranchId,
	note: optional(string()),
	residentId: Id,
});

export const GeriatricScoreSchema = object({
	assessedBy: Id,
	branchId: BranchId,
	kind: picklist(["ADL", "IADL", "Morse", "Braden", "MNA", "MMSE"]),
	note: optional(string()),
	residentId: Id,
	score: number(),
});

export const PolypharmacyReviewSchema = object({
	action: picklist(["continue", "deprescribe", "substitute", "dose-change"]),
	branchId: BranchId,
	meds: array(
		object({
			dose: string(),
			frequency: string(),
			name: pipe(string(), minLength(1)),
		}),
	),
	note: optional(string()),
	residentId: Id,
	reviewedBy: Id,
});

export const DailyLogSchema = object({
	appetite: optional(string()),
	branchId: BranchId,
	mood: optional(string()),
	note: pipe(string(), minLength(1, "Note is required")),
	residentId: Id,
});

export const RoundSchema = object({
	branchId: BranchId,
	doneBy: Id,
	findings: pipe(string(), minLength(1, "Findings are required")),
	plan: optional(string()),
	residentId: Id,
});

export const VisitLogSchema = object({
	branchId: BranchId,
	purpose: pipe(string(), minLength(1, "Purpose is required")),
	relation: optional(string()),
	residentId: Id,
	visitor: pipe(string(), minLength(1, "Visitor name is required")),
});

export const StayBillCompileSchema = object({
	branchId: BranchId,
	residentId: Id,
	uptoDate: optional(string()),
});

export const ResidentIdSchema = object({
	branchId: BranchId,
	id: Id,
});

export const ResidentListSchema = object({
	branchId: BranchId,
	limit: optional(pipe(number(), minValue(1), maxValue(500))),
});
