import {
	array,
	boolean,
	minLength,
	number,
	object,
	optional,
	picklist,
	pipe,
	string,
} from "valibot";

const BranchId = optional(string(), "main");
const EncounterId = pipe(string(), minLength(1, "Encounter ID is required"));

export const SpecialtySchema = picklist([
	"allopathy",
	"dental",
	"ayush",
	"physio",
	"speech",
	"psych",
]);

export const VisitTypeSchema = picklist([
	"new",
	"followup",
	"casualty",
	"tele",
]);

export const EncounterCreateSchema = object({
	appointmentId: optional(string()),
	branchId: BranchId,
	patientId: pipe(string(), minLength(1, "Patient ID is required")),
	specialty: SpecialtySchema,
	visitType: VisitTypeSchema,
});

export const EncounterIdSchema = object({ id: EncounterId });

export const DiagnosisSchema = object({
	code: pipe(string(), minLength(1, "Diagnosis code is required")),
	encounterId: EncounterId,
	kind: optional(picklist(["provisional", "confirmed"]), "provisional"),
	label: pipe(string(), minLength(1, "Diagnosis label is required")),
	patientId: pipe(string(), minLength(1, "Patient ID is required")),
	primary: optional(boolean(), false),
});

export const PrescriptionItemSchema = object({
	days: number(),
	dose: pipe(string(), minLength(1, "Dose is required")),
	drug: pipe(string(), minLength(1, "Drug name is required")),
	frequency: optional(pipe(string(), minLength(1, "Frequency is required"))),
	warnings: optional(array(string())),
});

export const PrescriptionSchema = object({
	acknowledgedWarnings: optional(array(string())),
	encounterId: EncounterId,
	items: array(PrescriptionItemSchema),
	patientId: pipe(string(), minLength(1, "Patient ID is required")),
});

export const RefillSchema = object({
	encounterId: EncounterId,
	patientId: pipe(string(), minLength(1, "Patient ID is required")),
	prescriptionId: pipe(string(), minLength(1, "Prescription ID is required")),
});

export const OrderSchema = object({
	encounterId: EncounterId,
	item: pipe(string(), minLength(1, "Order item is required")),
	kind: picklist([
		"lab",
		"radiology",
		"pharmacy",
		"procedure",
		"referral",
		"nursing",
	]),
	note: optional(string()),
	patientId: pipe(string(), minLength(1, "Patient ID is required")),
	receivingUnit: optional(pipe(string(), minLength(1))),
});

export const VitalsSchema = object({
	bp: optional(string()),
	encounterId: EncounterId,
	patientId: pipe(string(), minLength(1, "Patient ID is required")),
	pulse: optional(number()),
	spo2: optional(number()),
	tempC: optional(number()),
	weightKg: optional(number()),
});

export const FollowUpSchema = object({
	at: pipe(string(), minLength(1, "Follow-up date is required")),
	encounterId: EncounterId,
	note: optional(string()),
	patientId: pipe(string(), minLength(1, "Patient ID is required")),
});

export const AddendumSchema = object({
	encounterId: EncounterId,
	note: pipe(string(), minLength(1, "Addendum note is required")),
});

export const EncounterAllergySchema = object({
	branchId: BranchId,
	name: pipe(string(), minLength(1, "Allergy name is required")),
	note: optional(string()),
	patientId: pipe(string(), minLength(1, "Patient ID is required")),
	reaction: optional(pipe(string(), minLength(1))),
	severity: picklist(["mild", "moderate", "severe"]),
});

export const InteractionCheckSchema = object({
	acknowledged: optional(array(string()), []),
	allergies: optional(array(string()), []),
	branchId: BranchId,
	drugs: pipe(
		array(pipe(string(), minLength(1, "Drug is required"))),
		minLength(1, "Add at least one drug"),
	),
	encounterId: optional(string()),
	patientId: pipe(string(), minLength(1, "Patient ID is required")),
});
