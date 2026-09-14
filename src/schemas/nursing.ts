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
const PatientRef = object({
	branchId: BranchId,
	encounterId: optional(string()),
	patientId: Id,
});

export const TaskFromOrdersSchema = object({
	branchId: BranchId,
	encounterId: optional(string()),
	patientId: optional(string()),
});

export const VitalsSchema = object({
	bpDia: optional(number()),
	bpSys: optional(number()),
	branchId: BranchId,
	encounterId: optional(string()),
	note: optional(string()),
	patientId: Id,
	pulse: optional(number()),
	rr: optional(number()),
	spo2: optional(number()),
	temp: optional(number()),
});

export const IoSchema = object({
	branchId: BranchId,
	intakeMl: optional(pipe(number(), minValue(0))),
	note: optional(string()),
	outputMl: optional(pipe(number(), minValue(0))),
	patientId: Id,
});

export const PainSchema = object({
	branchId: BranchId,
	note: optional(string()),
	patientId: Id,
	phase: picklist(["pre", "post"]),
	score: pipe(number(), minValue(0), maxValue(10)),
});

export const RiskScreenSchema = object({
	branchId: BranchId,
	kind: picklist(["Morse", "Braden"]),
	patientId: Id,
	score: number(),
	screenedBy: Id,
});

export const DrugAdminSchema = object({
	batchId: Id,
	branchId: BranchId,
	doctorOverrideId: optional(string()),
	dose: pipe(string(), minLength(1, "Dose is required")),
	drug: pipe(string(), minLength(1, "Drug name is required")),
	note: optional(string()),
	orderId: optional(string()),
	outcome: picklist(["Given", "Held", "Refused", "Missed"]),
	patientId: Id,
	witness: optional(string()),
});

export const SittingSupportSchema = object({
	branchId: BranchId,
	note: optional(string()),
	patientId: Id,
	phase: picklist(["pre", "post"]),
});

export const HandoverSchema = object({
	branchId: BranchId,
	fromShift: picklist(["morning", "evening", "night"]),
	notes: pipe(string(), minLength(1, "Handover notes are required")),
	status: picklist(["draft", "signed"]),
	toShift: picklist(["morning", "evening", "night"]),
});

export const ChecklistSchema = object({
	branchId: BranchId,
	items: array(
		object({
			done: picklist(["yes", "no", "na"]),
			label: pipe(string(), minLength(1)),
		}),
	),
	name: pipe(string(), minLength(1, "Checklist name is required")),
	patientId: optional(string()),
});

export const TriageTagSchema = object({
	branchId: BranchId,
	patientId: Id,
	reason: pipe(string(), minLength(1, "Triage reason is required")),
	tag: picklist(["red", "yellow", "green"]),
});

export const NursingBoardSchema = object({
	branchId: BranchId,
});

export const NursingPatientRefSchema = PatientRef;
