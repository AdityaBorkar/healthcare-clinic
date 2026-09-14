import {
	array,
	maxLength,
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

export const AyushCaseSheetInputSchema = object({
	branchId: BranchIdSchema,
	complaints: RequiredText("Complaints"),
	dosha: RequiredText("Dosha"),
	encounterId: RequiredText("Encounter"),
	history: optional(pipe(string(), maxLength(4000))),
	nadi: RequiredText("Nadi"),
	pathy: picklist(["ayurveda", "yoga", "unani", "siddha", "homeopathy"]),
	patientId: RequiredText("Patient"),
	prakriti: picklist([
		"vata",
		"pitta",
		"kapha",
		"vata-pitta",
		"pitta-kapha",
		"vata-kapha",
		"tridoshic",
	]),
});

export const RepertorizationInputSchema = object({
	branchId: BranchIdSchema,
	caseId: RequiredText("Case sheet"),
	patientId: RequiredText("Patient"),
	potency: RequiredText("Potency"),
	remedy: RequiredText("Remedy"),
	rubrics: pipe(
		array(RequiredText("Rubric")),
		minLength(1, "Add at least one rubric"),
	),
});

export const FollowUpGridInputSchema = object({
	branchId: BranchIdSchema,
	caseId: RequiredText("Case sheet"),
	improvement: picklist(["worse", "same", "better", "resolved"]),
	notes: RequiredText("Notes"),
	patientId: RequiredText("Patient"),
	visitNo: pipe(number(), minValue(1, "Visit number must be at least 1")),
});

export const AyushDiagnosisInputSchema = object({
	branchId: BranchIdSchema,
	caseId: RequiredText("Case sheet"),
	encounterId: RequiredText("Encounter"),
	label: optional(pipe(string(), maxLength(500))),
	namasteCode: RequiredText("NAMASTE code"),
	patientId: RequiredText("Patient"),
	tm2Code: RequiredText("TM2 code"),
});

const VitalsSchema = object({
	bpDys: pipe(number(), minValue(0)),
	bpSys: pipe(number(), minValue(0)),
	pulse: pipe(number(), minValue(0)),
});

export const TherapyPackageInputSchema = object({
	branchId: BranchIdSchema,
	caseId: optional(pipe(string(), minLength(1))),
	name: picklist([
		"panchakarma",
		"abhyanga",
		"shirodhara",
		"nasya",
		"basti",
		"other",
	]),
	patientId: RequiredText("Patient"),
	status: picklist(["Active", "Paused", "Expired", "Completed"]),
	totalSittings: pipe(
		number(),
		minValue(1, "Package needs at least 1 sitting"),
	),
	validDays: optional(pipe(number(), minValue(1))),
});

export const TherapySittingInputSchema = object({
	branchId: BranchIdSchema,
	date: RequiredText("Date"),
	notes: optional(pipe(string(), maxLength(2000))),
	packageId: RequiredText("Therapy package"),
	patientId: RequiredText("Patient"),
	postVitals: VitalsSchema,
	preVitals: VitalsSchema,
	status: picklist(["Booked", "Attended", "Missed"]),
});

export const PackagePauseExtendInputSchema = object({
	action: picklist(["pause", "resume", "extend", "complete"]),
	extendDays: optional(pipe(number(), minValue(1))),
	packageId: RequiredText("Therapy package"),
	reason: optional(pipe(string(), maxLength(1000))),
});

export const DietPlanInputSchema = object({
	branchId: BranchIdSchema,
	caseId: optional(pipe(string(), minLength(1))),
	chart: RequiredText("Diet chart"),
	patientId: RequiredText("Patient"),
	validFrom: RequiredText("Valid from"),
	validTo: RequiredText("Valid to"),
});

export const YogaBatchInputSchema = object({
	branchId: BranchIdSchema,
	capacity: pipe(number(), minValue(1, "Capacity must be at least 1")),
	name: RequiredText("Batch name"),
	schedule: RequiredText("Schedule"),
});

export const YogaEnrollmentInputSchema = object({
	batchId: RequiredText("Yoga batch"),
	branchId: BranchIdSchema,
	patientId: RequiredText("Patient"),
});

export const BranchFilterSchema = object({
	branchId: BranchIdSchema,
});
