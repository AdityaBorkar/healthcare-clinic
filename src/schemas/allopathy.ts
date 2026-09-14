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

export const DiagnosisEntrySchema = object({
	code: RequiredText("Diagnosis code"),
	label: optional(pipe(string(), maxLength(500))),
	system: picklist(["ICD11", "TM2", "NAMASTE"]),
});

export const SoapNoteInputSchema = object({
	assessment: RequiredText("Assessment"),
	branchId: BranchIdSchema,
	diagnoses: pipe(
		array(DiagnosisEntrySchema),
		minLength(1, "At least one diagnosis is required before prescribing"),
	),
	encounterId: RequiredText("Encounter"),
	objective: RequiredText("Objective"),
	patientId: RequiredText("Patient"),
	plan: RequiredText("Plan"),
	subjective: RequiredText("Subjective"),
});

export const ExamFindingInputSchema = object({
	branchId: BranchIdSchema,
	encounterId: RequiredText("Encounter"),
	finding: RequiredText("Finding"),
	patientId: RequiredText("Patient"),
	severity: optional(picklist(["mild", "moderate", "severe"])),
	system: picklist([
		"general",
		"cvs",
		"rs",
		"cns",
		"abdomen",
		"ent",
		"eye",
		"skin",
		"mskus",
		"other",
	]),
});

export const ChronicLogInputSchema = object({
	antifungals: optional(pipe(string(), maxLength(1000))),
	bpDys: optional(pipe(number(), minValue(0), maxValue(300))),
	bpSys: optional(pipe(number(), minValue(0), maxValue(400))),
	branchId: BranchIdSchema,
	condition: picklist([
		"diabetes",
		"hypertension",
		"tb",
		"antenatal",
		"asthma",
		"copd",
		"epilepsy",
		"ckd",
		"thyroid",
		"other",
	]),
	encounterId: optional(pipe(string(), minLength(1))),
	fundalHeightCm: optional(pipe(number(), minValue(0), maxValue(60))),
	hba1c: optional(pipe(number(), minValue(0), maxValue(30))),
	parameter: RequiredText("Parameter"),
	patientId: RequiredText("Patient"),
	unit: RequiredText("Unit"),
	value: number("Value must be a number"),
});

export const ImmunizationInputSchema = object({
	branchId: BranchIdSchema,
	doseNo: pipe(number(), minValue(1, "Dose number must be at least 1")),
	dueDate: optional(pipe(string(), minLength(1))),
	givenAt: optional(pipe(string(), minLength(1))),
	patientId: RequiredText("Patient"),
	status: picklist(["Due", "Given", "Overdue"]),
	vaccine: RequiredText("Vaccine"),
});

export const EncounterFilterSchema = object({
	branchId: BranchIdSchema,
	encounterId: RequiredText("Encounter"),
});

export const BranchFilterSchema = object({
	branchId: BranchIdSchema,
});

export const RegisterEntryInputSchema = object({
	branchId: BranchIdSchema,
	diagnoses: optional(array(DiagnosisEntrySchema)),
	encounterId: optional(pipe(string(), minLength(1))),
	notes: optional(pipe(string(), maxLength(2000))),
	patientId: RequiredText("Patient"),
	registerType: picklist(["opd", "casualty", "tele", "followup"]),
	status: picklist(["Draft", "Final"]),
});

export const TriageEntryInputSchema = object({
	bpDys: optional(pipe(number(), minValue(0), maxValue(300))),
	bpSys: optional(pipe(number(), minValue(0), maxValue(400))),
	branchId: BranchIdSchema,
	encounterId: optional(pipe(string(), minLength(1))),
	painScore: optional(pipe(number(), minValue(0), maxValue(10))),
	patientId: RequiredText("Patient"),
	priority: picklist(["routine", "urgent", "emergency"]),
	pulse: optional(pipe(number(), minValue(0), maxValue(300))),
	rr: optional(pipe(number(), minValue(0), maxValue(120))),
	spo2: optional(pipe(number(), minValue(0), maxValue(100))),
	tempC: optional(pipe(number(), minValue(25), maxValue(46))),
});

export const ProblemStatusSchema = picklist(["active", "resolved"]);

export const ProblemUpsertSchema = object({
	branchId: BranchIdSchema,
	code: RequiredText("ICD-11 code"),
	encounterId: optional(pipe(string(), minLength(1))),
	label: optional(pipe(string(), maxLength(500))),
	patientId: RequiredText("Patient"),
	problemId: optional(pipe(string(), minLength(1))),
	status: ProblemStatusSchema,
	system: picklist(["ICD11", "TM2", "NAMASTE"]),
});

export const ProblemListFilterSchema = object({
	branchId: BranchIdSchema,
	limit: optional(number()),
	offset: optional(number()),
	patientId: RequiredText("Patient"),
	status: optional(ProblemStatusSchema),
});
