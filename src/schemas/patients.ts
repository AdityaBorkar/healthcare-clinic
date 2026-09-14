import {
	array,
	boolean,
	maxLength,
	minLength,
	object,
	optional,
	picklist,
	pipe,
	string,
} from "valibot";

import { NameSchema } from "#/schemas/common";

const BranchId = optional(string(), "main");
const PhoneSchema = pipe(
	string(),
	minLength(7, "Enter a valid phone number"),
	maxLength(20, "Enter a valid phone number"),
);

export const PatientRegisterSchema = object({
	abha: optional(string()),
	allergies: optional(array(string()), []),
	branchId: BranchId,
	dob: optional(string()),
	fullName: NameSchema,
	gender: optional(picklist(["male", "female", "other"])),
	guardian: optional(string()),
	language: optional(string(), "en"),
	phone: PhoneSchema,
});

export const DedupeCheckSchema = object({
	abha: optional(string()),
	branchId: BranchId,
	phone: optional(string()),
});

export const PatientIdSchema = object({
	id: pipe(string(), minLength(1, "Patient ID is required")),
});

export const FamilyLinkSchema = object({
	branchId: BranchId,
	linkedName: NameSchema,
	linkedPhone: optional(string()),
	patientId: pipe(string(), minLength(1, "Patient ID is required")),
	relation: pipe(string(), minLength(1, "Relation is required")),
});

export const AllergySchema = object({
	branchId: BranchId,
	name: pipe(string(), minLength(1, "Allergy name is required")),
	note: optional(string()),
	patientId: pipe(string(), minLength(1, "Patient ID is required")),
	severity: picklist(["mild", "moderate", "severe"]),
});

export const ConsentSchema = object({
	branchId: BranchId,
	granted: boolean(),
	note: optional(string()),
	patientId: pipe(string(), minLength(1, "Patient ID is required")),
	type: pipe(string(), minLength(1, "Consent type is required")),
});

export const FlagSchema = object({
	branchId: BranchId,
	label: pipe(string(), minLength(1, "Flag label is required")),
	level: picklist(["info", "watch", "critical"]),
	patientId: pipe(string(), minLength(1, "Patient ID is required")),
});

export const CommunicationLogSchema = object({
	branchId: BranchId,
	channel: picklist(["sms", "call", "whatsapp", "email", "in-person"]),
	message: pipe(string(), minLength(1, "Message is required")),
	patientId: pipe(string(), minLength(1, "Patient ID is required")),
});

export const RecallEnrolSchema = object({
	at: pipe(string(), minLength(1, "Recall date is required")),
	branchId: BranchId,
	patientId: pipe(string(), minLength(1, "Patient ID is required")),
	reason: pipe(string(), minLength(1, "Recall reason is required")),
});

export const MergeRequestSchema = object({
	branchId: BranchId,
	duplicateId: pipe(string(), minLength(1, "Duplicate patient ID is required")),
	primaryId: pipe(string(), minLength(1, "Primary patient ID is required")),
	reason: optional(string()),
});

export const ApproveMergeSchema = object({
	id: pipe(string(), minLength(1, "Merge request ID is required")),
});

export const PatientListSchema = object({
	branchId: BranchId,
	limit: optional(pipe(string(), minLength(1)), "100"),
});
