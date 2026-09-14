import {
	array,
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

export const RehabEpisodeInputSchema = object({
	branchId: BranchIdSchema,
	condition: RequiredText("Condition"),
	discipline: picklist(["occupational", "physio", "speech"]),
	encounterId: optional(pipe(string(), minLength(1))),
	patientId: RequiredText("Patient"),
	status: picklist(["Active", "Discharged"]),
});

export const RehabAssessmentToolSchema = picklist([
	"MMT",
	"ROM",
	"Berg",
	"Barthel",
	"FIM",
	"VAS",
	"gait",
	"GUSS",
	"FOIS",
]);

export const RehabAssessmentInputSchema = object({
	branchId: BranchIdSchema,
	details: optional(pipe(string(), maxLength(4000))),
	episodeId: RequiredText("Episode"),
	items: optional(
		array(
			object({
				label: RequiredText("Item"),
				score: pipe(number("Item score must be a number"), minValue(0)),
			}),
		),
	),
	maxScore: optional(pipe(number(), minValue(0))),
	mmtGrade: optional(pipe(string(), minLength(1))),
	patientId: RequiredText("Patient"),
	romDegrees: optional(pipe(number(), minValue(0), maxValue(360))),
	romType: optional(picklist(["active", "passive"])),
	score: pipe(number("Score must be a number")),
	status: picklist(["Draft", "Final"]),
	tool: RehabAssessmentToolSchema,
});

export const RehabGoalPlanInputSchema = object({
	branchId: BranchIdSchema,
	episodeId: RequiredText("Episode"),
	goals: pipe(
		array(
			object({
				goal: RequiredText("Goal"),
				linkedScale: optional(RehabAssessmentToolSchema),
				measure: optional(pipe(string(), maxLength(500))),
				status: picklist(["open", "met", "abandoned"]),
				targetDate: optional(pipe(string(), minLength(1))),
				term: optional(picklist(["LT", "ST"])),
			}),
		),
		minLength(1, "Set at least one goal"),
	),
	patientId: RequiredText("Patient"),
});

export const RehabPackageInputSchema = object({
	branchId: BranchIdSchema,
	episodeId: RequiredText("Episode"),
	frequency: RequiredText("Frequency"),
	modalities: optional(array(pipe(string(), minLength(1)))),
	patientId: RequiredText("Patient"),
	price: optional(pipe(number(), minValue(0))),
	totalSessions: pipe(
		number(),
		minValue(1, "Package needs at least 1 session"),
	),
	validityDays: optional(pipe(number(), minValue(1))),
});

export const RehabSittingStatusSchema = picklist([
	"Booked",
	"CheckedIn",
	"InProgress",
	"Completed",
	"Cancelled",
	"NoShow",
]);

export const RehabSittingBookInputSchema = object({
	branchId: BranchIdSchema,
	date: RequiredText("Date"),
	episodeId: RequiredText("Episode"),
	equipmentId: optional(pipe(string(), minLength(1))),
	packageId: optional(pipe(string(), minLength(1))),
	patientId: RequiredText("Patient"),
	slot: optional(pipe(string(), minLength(1))),
	therapistId: optional(pipe(string(), minLength(1))),
});

export const RehabSittingRecordInputSchema = object({
	branchId: BranchIdSchema,
	consumables: optional(
		array(
			object({
				item: RequiredText("Consumable"),
				qty: pipe(number(), minValue(1)),
			}),
		),
	),
	dosage: optional(pipe(string(), maxLength(500))),
	durationMins: optional(pipe(number(), minValue(1))),
	equipmentId: optional(pipe(string(), minLength(1))),
	exercises: optional(
		array(
			object({
				name: RequiredText("Exercise"),
				reps: optional(pipe(number(), minValue(0))),
				sets: optional(pipe(number(), minValue(0))),
			}),
		),
	),
	modality: optional(pipe(string(), minLength(1))),
	notes: optional(pipe(string(), maxLength(2000))),
	postVitals: object({
		bpDys: pipe(number(), minValue(0)),
		bpSys: pipe(number(), minValue(0)),
		pulse: pipe(number(), minValue(0)),
	}),
	preVitals: object({
		bpDys: pipe(number(), minValue(0)),
		bpSys: pipe(number(), minValue(0)),
		pulse: pipe(number(), minValue(0)),
	}),
	sittingId: RequiredText("Sitting"),
	status: RehabSittingStatusSchema,
	therapistId: optional(pipe(string(), minLength(1))),
});

export const ExercisePrescriptionInputSchema = object({
	branchId: BranchIdSchema,
	episodeId: RequiredText("Episode"),
	exercises: pipe(
		array(
			object({
				frequency: optional(pipe(string(), maxLength(200))),
				holdSecs: optional(pipe(number(), minValue(0))),
				mediaUrl: optional(pipe(string(), maxLength(2000))),
				name: RequiredText("Exercise"),
				notes: optional(pipe(string(), maxLength(500))),
				precautions: optional(pipe(string(), maxLength(1000))),
				reps: optional(pipe(number(), minValue(0))),
				sets: optional(pipe(number(), minValue(0))),
			}),
		),
		minLength(1, "Prescribe at least one exercise"),
	),
	patientId: RequiredText("Patient"),
});

export const OutcomeScoreInputSchema = object({
	branchId: BranchIdSchema,
	episodeId: RequiredText("Episode"),
	patientId: RequiredText("Patient"),
	score: pipe(number("Score must be a number")),
	tool: RehabAssessmentToolSchema,
});

export const DischargeSummaryInputSchema = object({
	branchId: BranchIdSchema,
	episodeId: RequiredText("Episode"),
	homePlan: optional(pipe(string(), maxLength(4000))),
	outcome: picklist(["recovered", "improved", "same", "referred", "dropped"]),
	patientId: RequiredText("Patient"),
	summary: RequiredText("Summary"),
});

export const ProgressChartInputSchema = object({
	branchId: BranchIdSchema,
	episodeId: RequiredText("Episode"),
	tool: optional(RehabAssessmentToolSchema),
});

export const ShareExerciseSheetInputSchema = object({
	branchId: BranchIdSchema,
	channel: picklist(["print", "whatsapp"]),
	sheetId: RequiredText("Sheet"),
	to: optional(pipe(string(), maxLength(50))),
});

export const BranchFilterSchema = object({
	branchId: BranchIdSchema,
});
