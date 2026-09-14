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
	regex,
	string,
} from "valibot";

export const BranchIdSchema = optional(
	pipe(string(), minLength(1, "Branch is required")),
	"main",
);

const RequiredText = (label: string) =>
	pipe(string(), minLength(1, `${label} is required`));

const NonNegative = (label: string) =>
	pipe(
		number(`${label} must be a number`),
		minValue(0, `${label} cannot be negative`),
	);

const Percent = (label: string) =>
	pipe(
		number(`${label} must be a number`),
		minValue(0, `${label} cannot be negative`),
		maxValue(100, `${label} cannot exceed 100`),
	);

/** FDI notation: 11-18, 21-28, 31-38, 41-48 permanent + 51-55, 61-65, 71-75, 81-85 deciduous. */
export const FdiToothSchema = pipe(
	string(),
	regex(
		/^(1[1-8]|2[1-8]|3[1-8]|4[1-8]|5[1-5]|6[1-5]|7[1-5]|8[1-5])$/,
		"Must be a valid FDI tooth number",
	),
);

export const ToothConditionSchema = picklist([
	"healthy",
	"caries",
	"fracture",
	"missing",
	"filling",
	"crown",
	"implant",
	"root-canal",
	"perio",
	"abscess",
	"other",
]);

export const ToothSurfaceSchema = picklist([
	"mesial",
	"distal",
	"buccal",
	"lingual",
	"occlusal",
	"incisal",
]);

export const DentalChartInputSchema = object({
	branchId: BranchIdSchema,
	encounterId: RequiredText("Encounter"),
	entries: pipe(
		array(
			object({
				condition: ToothConditionSchema,
				notes: optional(pipe(string(), maxLength(500))),
				surface: optional(ToothSurfaceSchema),
				tooth: FdiToothSchema,
			}),
		),
		minLength(1, "Chart at least one tooth"),
	),
	patientId: RequiredText("Patient"),
});

export const PlanStageSchema = picklist([
	"Planned",
	"Scheduled",
	"InChair",
	"Done",
]);

export const TreatmentPlanInputSchema = object({
	branchId: BranchIdSchema,
	encounterId: RequiredText("Encounter"),
	patientId: RequiredText("Patient"),
	stages: pipe(
		array(
			object({
				price: NonNegative("Price"),
				procedure: RequiredText("Procedure"),
				stage: PlanStageSchema,
				tooth: optional(FdiToothSchema),
			}),
		),
		minLength(1, "Plan at least one stage"),
	),
	status: picklist(["Draft", "Approved", "InProgress", "Completed"]),
});

export const QuoteInputSchema = object({
	branchId: BranchIdSchema,
	discountPct: optional(Percent("Discount")),
	gstPct: optional(Percent("GST")),
	patientId: RequiredText("Patient"),
	planId: RequiredText("Treatment plan"),
	validDays: optional(pipe(number(), minValue(1))),
	validTill: optional(pipe(string(), minLength(1))),
});

export const ConsentFormInputSchema = object({
	branchId: BranchIdSchema,
	encounterId: RequiredText("Encounter"),
	patientId: RequiredText("Patient"),
	procedureName: RequiredText("Procedure"),
	signedAt: optional(pipe(string(), minLength(1))),
	status: picklist(["Pending", "Signed"]),
});

export const ChairSlotInputSchema = object({
	branchId: BranchIdSchema,
	bufferMin: optional(pipe(number(), minValue(0))),
	chairId: RequiredText("Chair"),
	date: RequiredText("Date"),
	durationMin: optional(pipe(number(), minValue(1))),
	encounterId: RequiredText("Encounter"),
	patientId: RequiredText("Patient"),
	slot: RequiredText("Slot"),
});

export const LabJobInputSchema = object({
	branchId: BranchIdSchema,
	dueDate: optional(pipe(string(), minLength(1))),
	encounterId: optional(pipe(string(), minLength(1))),
	kind: picklist(["crown", "bridge", "denture", "implant", "aligner", "other"]),
	labName: RequiredText("Lab"),
	metal: optional(pipe(string(), maxLength(500))),
	patientId: RequiredText("Patient"),
	planId: optional(pipe(string(), minLength(1))),
	qcNote: optional(pipe(string(), maxLength(1000))),
	shade: optional(pipe(string(), maxLength(100))),
	status: picklist(["Raised", "InLab", "Trial", "Delivered", "Remake"]),
	tooth: optional(FdiToothSchema),
});

export const LabJobTrackInputSchema = object({
	labJobId: RequiredText("Lab job"),
	note: optional(pipe(string(), maxLength(1000))),
	status: picklist(["Raised", "InLab", "Trial", "Delivered", "Remake"]),
});

export const PlanStageCloseInputSchema = object({
	completed: optional(boolean()),
	nextAppointment: optional(pipe(string(), minLength(1))),
	note: optional(pipe(string(), maxLength(2000))),
	planId: RequiredText("Treatment plan"),
	stageIndex: pipe(
		number("Stage index must be a number"),
		minValue(0, "Stage index cannot be negative"),
	),
	to: PlanStageSchema,
});

export const RescheduleStageInputSchema = object({
	newDate: RequiredText("New date"),
	newSlot: optional(pipe(string(), minLength(1))),
	planId: RequiredText("Treatment plan"),
	reason: optional(pipe(string(), maxLength(1000))),
	stageIndex: pipe(
		number("Stage index must be a number"),
		minValue(0, "Stage index cannot be negative"),
	),
});

export const ImplantMilestoneInputSchema = object({
	healingNote: optional(pipe(string(), maxLength(2000))),
	milestone: picklist(["placement", "healing", "loading"]),
	planId: RequiredText("Treatment plan"),
	stageIndex: pipe(
		number("Stage index must be a number"),
		minValue(0, "Stage index cannot be negative"),
	),
});

export const DentalPackageInputSchema = object({
	branchId: BranchIdSchema,
	name: RequiredText("Package name"),
	patientId: RequiredText("Patient"),
	planId: RequiredText("Treatment plan"),
	price: pipe(number(), minValue(0)),
});

export const PendingJobsFilterSchema = object({
	branchId: BranchIdSchema,
	patientId: optional(pipe(string(), minLength(1))),
	planId: optional(pipe(string(), minLength(1))),
	status: optional(
		picklist(["Raised", "InLab", "Trial", "Delivered", "Remake"]),
	),
});

export const BranchFilterSchema = object({
	branchId: BranchIdSchema,
});
