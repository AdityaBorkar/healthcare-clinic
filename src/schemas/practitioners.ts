import {
	array,
	boolean,
	integer,
	minLength,
	minValue,
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

// Fee heads for OPD billing (P1 practitioner completeness).
export const PractitionerFeeHeadSchema = picklist(["new", "revisit", "tele"]);

export const PractitionerCreateSchema = object({
	bio: optional(string()),
	boardRegNo: optional(string()),
	branchId: BranchId,
	email: optional(string()),
	feeNew: optional(pipe(number(), minValue(0))),
	feeRevisit: optional(pipe(number(), minValue(0))),
	feeTele: optional(pipe(number(), minValue(0))),
	languages: optional(array(string()), []),
	name: NameSchema,
	onPresenceBoard: optional(boolean(), true),
	overallYrs: optional(pipe(number(), integer(), minValue(0))),
	phone: optional(string()),
	photoUrl: optional(string()),
	signatureUrl: optional(string()),
	specialistYrs: optional(pipe(number(), integer(), minValue(0))),
	specializations: optional(array(pipe(string(), minLength(1))), []),
	specialty: optional(string()),
});

export const PractitionerIdSchema = object({ id: PractitionerId });

export const PractitionerPatchSchema = object({
	id: PractitionerId,
	patch: object({
		bio: optional(string()),
		boardRegNo: optional(string()),
		email: optional(string()),
		feeNew: optional(pipe(number(), minValue(0))),
		feeRevisit: optional(pipe(number(), minValue(0))),
		feeTele: optional(pipe(number(), minValue(0))),
		languages: optional(array(string())),
		name: optional(NameSchema),
		onPresenceBoard: optional(boolean()),
		overallYrs: optional(pipe(number(), integer(), minValue(0))),
		phone: optional(string()),
		photoUrl: optional(string()),
		signatureUrl: optional(string()),
		specialistYrs: optional(pipe(number(), integer(), minValue(0))),
		specializations: optional(array(pipe(string(), minLength(1)))),
		specialty: optional(string()),
	}),
});

export const PractitionerListSchema = object({
	branchId: BranchId,
	search: optional(string()),
	specializations: optional(array(pipe(string(), minLength(1)))),
	specialty: optional(string()),
	status: optional(string()),
});

export const RegistrationSchema = object({
	branchId: BranchId,
	council: pipe(string(), minLength(1, "Council is required")),
	practitionerId: PractitionerId,
	regNo: pipe(string(), minLength(1, "Registration number is required")),
	renewalDate: optional(string()),
	year: optional(pipe(number(), integer())),
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
	head: optional(PractitionerFeeHeadSchema, "new"),
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
