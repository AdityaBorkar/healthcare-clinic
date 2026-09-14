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
	history: optional(string()),
	idNumber: optional(string()),
	name: pipe(string(), minLength(1, "Name is required")),
	nokName: pipe(string(), minLength(1, "Next-of-kin name is required")),
	nokPhone: pipe(string(), minLength(1, "Next-of-kin phone is required")),
	payerName: optional(string()),
	payerPhone: optional(string()),
	phone: pipe(string(), minLength(1, "Phone is required")),
	roomType: optional(string()),
	sex: picklist(["male", "female", "other"]),
	stayType: optional(picklist(["long-stay", "short-stay"])),
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
	activity: optional(string()),
	appetite: optional(string()),
	bpDys: optional(pipe(number(), minValue(0))),
	bpSys: optional(pipe(number(), minValue(0))),
	branchId: BranchId,
	diet: optional(string()),
	medsGiven: optional(string()),
	mood: optional(string()),
	note: pipe(string(), minLength(1, "Note is required")),
	physio: optional(string()),
	residentId: Id,
	spo2: optional(pipe(number(), minValue(0), maxValue(100))),
	sugarMgDl: optional(pipe(number(), minValue(0))),
	tempC: optional(pipe(number(), minValue(0))),
});

export const RoundSchema = object({
	branchId: BranchId,
	doneBy: Id,
	findings: pipe(string(), minLength(1, "Findings are required")),
	nursingTasks: optional(array(pipe(string(), minLength(1)))),
	plan: optional(string()),
	referralNote: optional(string()),
	residentId: Id,
});

export const VisitLogSchema = object({
	branchId: BranchId,
	purpose: pipe(string(), minLength(1, "Purpose is required")),
	relation: optional(string()),
	residentId: Id,
	timeIn: optional(string()),
	timeOut: optional(string()),
	visitor: pipe(string(), minLength(1, "Visitor name is required")),
});

export const StayChargeSchema = object({
	amount: pipe(number(), minValue(0)),
	branchId: BranchId,
	chargeDate: pipe(string(), minLength(1, "Charge date is required")),
	kind: optional(
		picklist([
			"care",
			"consumable",
			"credit-note",
			"debit-note",
			"meal",
			"stay",
		]),
		"stay",
	),
	reason: optional(string()),
	residentId: Id,
});

export const FeedbackSchema = object({
	actionTaken: optional(string()),
	branchId: BranchId,
	category: picklist(["family", "resident", "staff"]),
	message: pipe(string(), minLength(1, "Feedback is required")),
	residentId: optional(string()),
	submittedBy: Id,
});

export const RaiseAlertSchema = object({
	branchId: BranchId,
	kind: picklist([
		"chest-pain",
		"fall",
		"missed-dose",
		"missed-meal",
		"ulcer",
		"other",
	]),
	note: pipe(string(), minLength(1, "Alert note is required")),
	residentId: Id,
});

export const FamilySummarySendSchema = object({
	branchId: BranchId,
	channel: optional(picklist(["sms", "whatsapp"]), "whatsapp"),
	id: Id,
	to: pipe(string(), minLength(1, "Recipient is required")),
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
