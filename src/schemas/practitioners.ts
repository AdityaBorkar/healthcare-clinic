import {
	boolean,
	minLength,
	number,
	object,
	optional,
	picklist,
	pipe,
	string,
} from "valibot";

import { NameSchema } from "#/schemas/common";

const BranchId = optional(string(), "main");
const PractitionerId = pipe(
	string(),
	minLength(1, "Practitioner ID is required"),
);

export const PractitionerCreateSchema = object({
	branchId: BranchId,
	email: optional(string()),
	name: NameSchema,
	overallYrs: optional(number()),
	phone: optional(string()),
	specialistYrs: optional(number()),
	specialty: optional(string()),
});

export const PractitionerIdSchema = object({ id: PractitionerId });

export const PractitionerPatchSchema = object({
	id: PractitionerId,
	patch: object({
		email: optional(string()),
		name: optional(NameSchema),
		overallYrs: optional(number()),
		phone: optional(string()),
		specialistYrs: optional(number()),
		specialty: optional(string()),
	}),
});

export const PractitionerListSchema = object({ branchId: BranchId });

export const RegistrationSchema = object({
	branchId: BranchId,
	council: pipe(string(), minLength(1, "Council is required")),
	practitionerId: PractitionerId,
	regNo: pipe(string(), minLength(1, "Registration number is required")),
	year: optional(number()),
});

export const EducationSchema = object({
	branchId: BranchId,
	degree: pipe(string(), minLength(1, "Degree is required")),
	institute: optional(string()),
	practitionerId: PractitionerId,
	year: optional(number()),
});

export const PostingSchema = object({
	branchId: BranchId,
	facilityId: optional(string()),
	from: pipe(string(), minLength(1, "Posting start is required")),
	practitionerId: PractitionerId,
	to: optional(string()),
});

export const ScheduleSchema = object({
	branchId: BranchId,
	bufferMin: optional(number(), 0),
	emergencyCount: optional(number(), 0),
	end: pipe(string(), minLength(1, "End time is required")),
	facilityId: optional(string()),
	practitionerId: PractitionerId,
	slotMin: optional(number(), 15),
	start: pipe(string(), minLength(1, "Start time is required")),
	videoFlag: optional(boolean(), false),
	weekday: picklist(["mon", "tue", "wed", "thu", "fri", "sat", "sun"]),
});

export const FeeSchema = object({
	amount: number(),
	branchId: BranchId,
	effectiveFrom: optional(string()),
	practitionerId: PractitionerId,
	serviceId: optional(string()),
});

export const LeaveBlockSchema = object({
	branchId: BranchId,
	from: pipe(string(), minLength(1, "Leave start is required")),
	practitionerId: PractitionerId,
	reason: optional(string()),
	to: pipe(string(), minLength(1, "Leave end is required")),
});

export const ConflictQuerySchema = object({
	from: pipe(string(), minLength(1, "Range start is required")),
	practitionerId: PractitionerId,
	to: pipe(string(), minLength(1, "Range end is required")),
});

export const NextSlotQuerySchema = object({
	branchId: BranchId,
	from: optional(string()),
	practitionerId: PractitionerId,
});
