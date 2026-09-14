import {
	array,
	boolean,
	maxLength,
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

export const BranchIdSchema = optional(
	pipe(string(), minLength(1, "Branch is required")),
	"main",
);

const RequiredText = (label: string) =>
	pipe(string(), minLength(1, `${label} is required`));

export const PsychAssessmentInputSchema = object({
	branchId: BranchIdSchema,
	chiefComplaint: RequiredText("Chief complaint"),
	encounterId: RequiredText("Encounter"),
	history: RequiredText("History"),
	impression: RequiredText("Impression"),
	mentalStatusExam: RequiredText("Mental status exam"),
	patientId: RequiredText("Patient"),
});

export const PsychScaleSchema = picklist([
	"PHQ9",
	"GAD7",
	"YMRS",
	"HAMD",
	"HAMA",
	"MMSE",
	"MoCA",
	"AUDIT",
	"DAST",
]);

export const ScaleResultInputSchema = object({
	assessmentId: optional(pipe(string(), minLength(1))),
	branchId: BranchIdSchema,
	encounterId: RequiredText("Encounter"),
	maxScore: pipe(number(), minValue(1)),
	override: optional(boolean()),
	overrideReason: optional(pipe(string(), maxLength(1000))),
	patientId: RequiredText("Patient"),
	scale: PsychScaleSchema,
	score: pipe(number("Score must be a number"), minValue(0)),
});

export const RiskScreenInputSchema = object({
	branchId: BranchIdSchema,
	encounterId: RequiredText("Encounter"),
	factors: pipe(
		array(RequiredText("Risk factor")),
		minLength(1, "Record at least one risk factor"),
	),
	level: picklist(["Low", "Moderate", "High"]),
	patientId: RequiredText("Patient"),
});

export const SafetyPlanInputSchema = object({
	branchId: BranchIdSchema,
	contacts: pipe(
		array(RequiredText("Contact")),
		minLength(1, "Add at least one emergency contact"),
	),
	copingStrategies: RequiredText("Coping strategies"),
	encounterId: RequiredText("Encounter"),
	meansRestriction: RequiredText("Means restriction"),
	patientId: RequiredText("Patient"),
	warningSigns: RequiredText("Warning signs"),
});

export const SeniorAlertInputSchema = object({
	branchId: BranchIdSchema,
	encounterId: optional(pipe(string(), minLength(1))),
	patientId: RequiredText("Patient"),
	reason: RequiredText("Reason"),
});

export const CounsellingBookInputSchema = object({
	branchId: BranchIdSchema,
	consentId: optional(pipe(string(), minLength(1))),
	date: RequiredText("Date"),
	durationMins: picklist([30, 45, 60]),
	encounterId: optional(pipe(string(), minLength(1))),
	link: optional(pipe(string(), maxLength(2000))),
	mode: picklist(["in-person", "tele"]),
	notes: optional(pipe(string(), maxLength(2000))),
	patientId: RequiredText("Patient"),
	patientIsMinor: optional(boolean()),
});

export const WithdrawalChartInputSchema = object({
	branchId: BranchIdSchema,
	chartSchedule: optional(pipe(string(), maxLength(500))),
	encounterId: optional(pipe(string(), minLength(1))),
	lastUseAt: optional(pipe(string(), minLength(1))),
	patientId: RequiredText("Patient"),
	score: pipe(number("Score must be a number"), minValue(0)),
	substance: optional(pipe(string(), maxLength(500))),
	substanceHistory: optional(pipe(string(), maxLength(4000))),
	tool: picklist(["CIWA", "CoWS"]),
});

export const RelapsePlanInputSchema = object({
	branchId: BranchIdSchema,
	followUpDates: optional(array(pipe(string(), minLength(1)))),
	patientId: RequiredText("Patient"),
	responses: RequiredText("Planned responses"),
	supportContacts: pipe(
		array(RequiredText("Support contact")),
		minLength(1, "Add at least one support contact"),
	),
	triggers: pipe(
		array(RequiredText("Trigger")),
		minLength(1, "List at least one trigger"),
	),
});

export const ControlledPrescriptionInputSchema = object({
	branchId: BranchIdSchema,
	daysSupply: pipe(number(), minValue(1, "Days supply must be at least 1")),
	encounterId: RequiredText("Encounter"),
	lastRefillAt: optional(pipe(string(), minLength(1))),
	maxDays: optional(pipe(number(), minValue(1))),
	medicine: RequiredText("Medicine"),
	override: optional(boolean()),
	overrideReason: optional(pipe(string(), maxLength(1000))),
	patientId: RequiredText("Patient"),
	qty: pipe(number(), minValue(1, "Quantity must be at least 1")),
});

export const SideEffectCheckInputSchema = object({
	branchId: BranchIdSchema,
	effects: array(pipe(string(), maxLength(300))),
	eps: optional(picklist(["none", "mild", "moderate", "severe"])),
	metabolic: optional(picklist(["none", "flagged"])),
	patientId: RequiredText("Patient"),
	prescriptionId: RequiredText("Prescription"),
	sedation: optional(picklist(["none", "mild", "moderate", "severe"])),
	severity: picklist(["none", "mild", "moderate", "severe"]),
	weightKg: optional(pipe(number(), minValue(0))),
});

export const CaregiverConsentInputSchema = object({
	branchId: BranchIdSchema,
	caregiverName: RequiredText("Caregiver name"),
	encounterId: optional(pipe(string(), minLength(1))),
	idNumber: optional(pipe(string(), maxLength(100))),
	patientId: RequiredText("Patient"),
	patientIsMinor: optional(boolean()),
	relation: RequiredText("Relation"),
	scope: RequiredText("Scope"),
	status: picklist(["Pending", "Signed"]),
});

export const InvoluntaryHookInputSchema = object({
	authority: optional(pipe(string(), maxLength(500))),
	branchId: BranchIdSchema,
	encounterId: optional(pipe(string(), minLength(1))),
	legalRef: RequiredText("Legal reference"),
	patientId: RequiredText("Patient"),
	reason: RequiredText("Reason"),
	reviewDate: optional(pipe(string(), minLength(1))),
});

export const BreakGlassInputSchema = object({
	branchId: BranchIdSchema,
	patientId: RequiredText("Patient"),
	reason: pipe(string(), minLength(10, "Break-glass needs a detailed reason")),
});

export const RecallListInputSchema = object({
	branchId: BranchIdSchema,
	limit: optional(
		pipe(number(), minValue(1), maxValue(200, "Limit cannot exceed 200")),
	),
	minDaysOverdue: optional(pipe(number(), minValue(0))),
	riskLevel: optional(picklist(["Low", "Moderate", "High"])),
});

export const CloseReadinessInputSchema = object({
	branchId: BranchIdSchema,
	encounterId: RequiredText("Encounter"),
	patientId: RequiredText("Patient"),
});

export const BranchFilterSchema = object({
	branchId: BranchIdSchema,
});
