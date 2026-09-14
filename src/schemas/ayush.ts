import {
	array,
	boolean,
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
	agni: optional(pipe(string(), maxLength(500))),
	branchId: BranchIdSchema,
	complaints: RequiredText("Complaints"),
	dosha: RequiredText("Dosha"),
	encounterId: RequiredText("Encounter"),
	history: optional(pipe(string(), maxLength(4000))),
	koshtha: optional(picklist(["mrudu", "madhya", "krura"])),
	mala: optional(pipe(string(), maxLength(500))),
	nadi: RequiredText("Nadi"),
	pathy: picklist(["ayurveda", "yoga", "unani", "siddha", "homeopathy"]),
	patientId: RequiredText("Patient"),
	planLines: optional(
		array(
			object({
				arm: picklist(["shodhana", "shamana"]),
				detail: pipe(string(), minLength(1), maxLength(1000)),
			}),
		),
	),
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
	dose: optional(pipe(string(), maxLength(500))),
	miasm: optional(
		picklist(["psora", "sycosis", "syphilis", "tubercular", "mixed"]),
	),
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
	outcomeNote: optional(pipe(string(), maxLength(2000))),
	patientId: RequiredText("Patient"),
	procedures: optional(array(pipe(string(), minLength(1), maxLength(200)))),
	status: picklist(["Active", "Paused", "Expired", "Completed"]),
	totalSittings: pipe(
		number(),
		minValue(1, "Package needs at least 1 sitting"),
	),
	validDays: optional(pipe(number(), minValue(1))),
});

const ChargeLineSchema = object({
	amount: pipe(number(), minValue(0)),
	label: RequiredText("Charge label"),
});

const ConsumableLineSchema = object({
	item: RequiredText("Consumable"),
	qty: pipe(number(), minValue(0)),
});

export const TherapySittingInputSchema = object({
	branchId: BranchIdSchema,
	chargeLines: optional(array(ChargeLineSchema)),
	consumables: optional(array(ConsumableLineSchema)),
	date: RequiredText("Date"),
	equipmentId: optional(pipe(string(), minLength(1))),
	notes: optional(pipe(string(), maxLength(2000))),
	packageId: RequiredText("Therapy package"),
	patientId: RequiredText("Patient"),
	postVitals: VitalsSchema,
	preVitals: VitalsSchema,
	roomId: optional(pipe(string(), minLength(1))),
	status: picklist(["Booked", "Attended", "Missed"]),
	therapistId: optional(pipe(string(), minLength(1))),
});

export const PackagePauseExtendInputSchema = object({
	action: picklist(["pause", "resume", "extend", "complete"]),
	extendDays: optional(pipe(number(), minValue(1))),
	outcomeNote: optional(pipe(string(), maxLength(2000))),
	packageId: RequiredText("Therapy package"),
	reason: optional(pipe(string(), maxLength(1000))),
});

export const DietPlanInputSchema = object({
	branchId: BranchIdSchema,
	caseId: optional(pipe(string(), minLength(1))),
	chart: RequiredText("Diet chart"),
	language: optional(pipe(string(), minLength(1))),
	pathyVariant: optional(
		picklist(["ayurveda", "homeopathy", "allopathy", "dental"]),
	),
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

export const NadiBookingInputSchema = object({
	branchId: BranchIdSchema,
	caseId: optional(pipe(string(), minLength(1))),
	date: RequiredText("Date"),
	encounterId: optional(pipe(string(), minLength(1))),
	facilityId: RequiredText("Facility"),
	findings: optional(pipe(string(), maxLength(2000))),
	patientId: RequiredText("Patient"),
	serviceId: RequiredText("Service"),
	slot: RequiredText("Slot"),
});

export const BranchFilterSchema = object({
	branchId: BranchIdSchema,
});

export const FollowUpGridListSchema = object({
	branchId: BranchIdSchema,
	caseId: RequiredText("Case sheet"),
});

export const YogaAttendanceInputSchema = object({
	attended: boolean(),
	batchId: RequiredText("Yoga batch"),
	branchId: BranchIdSchema,
	date: RequiredText("Date"),
	patientId: RequiredText("Patient"),
});

export const AyushPrescriptionInputSchema = object({
	anupana: optional(pipe(string(), maxLength(500))),
	branchId: BranchIdSchema,
	caseId: optional(pipe(string(), minLength(1))),
	encounterId: RequiredText("Encounter"),
	items: pipe(
		array(
			object({
				dose: RequiredText("Dose"),
				drug: RequiredText("Drug"),
				kind: picklist(["classical", "proprietary"]),
			}),
		),
		minLength(1, "Add at least one medicine"),
	),
	patientId: RequiredText("Patient"),
});

export const PackageOutcomeInputSchema = object({
	branchId: BranchIdSchema,
	outcomeNote: RequiredText("Outcome note"),
	packageId: RequiredText("Therapy package"),
});
