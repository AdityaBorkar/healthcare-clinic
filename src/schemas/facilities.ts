import { minLength, object, optional, picklist, pipe, string } from "valibot";

import { NameSchema } from "#/schemas/common";

const BranchId = optional(string(), "main");
const FacilityId = pipe(string(), minLength(1, "Facility ID is required"));

export const FacilityCategorySchema = picklist([
	"consultation",
	"procedure",
	"diagnostics",
	"pharmacy",
	"ward",
	"tele",
	"support",
]);

export const FacilityCreateSchema = object({
	branchId: BranchId,
	category: FacilityCategorySchema,
	code: optional(string()),
	name: NameSchema,
});

export const FacilityIdSchema = object({ id: FacilityId });

export const FacilityPatchSchema = object({
	id: FacilityId,
	patch: object({
		category: optional(FacilityCategorySchema),
		code: optional(string()),
		name: optional(NameSchema),
	}),
});

export const FacilityListSchema = object({ branchId: BranchId });

export const FacilityScheduleSchema = object({
	branchId: BranchId,
	close: pipe(string(), minLength(1, "Close time is required")),
	facilityId: FacilityId,
	open: pipe(string(), minLength(1, "Open time is required")),
	weekday: picklist(["mon", "tue", "wed", "thu", "fri", "sat", "sun"]),
});

export const FacilityBlockSchema = object({
	branchId: BranchId,
	facilityId: FacilityId,
	from: pipe(string(), minLength(1, "Block start is required")),
	reason: optional(string()),
	to: pipe(string(), minLength(1, "Block end is required")),
});

export const SterilizationLogSchema = object({
	at: pipe(string(), minLength(1, "Log time is required")),
	branchId: BranchId,
	by: optional(string()),
	facilityId: FacilityId,
	item: pipe(string(), minLength(1, "Item is required")),
	method: pipe(string(), minLength(1, "Method is required")),
});

export const OccupySchema = object({
	branchId: BranchId,
	facilityId: FacilityId,
	note: optional(string()),
});

export const ReleaseSchema = object({
	branchId: BranchId,
	facilityId: FacilityId,
	note: optional(string()),
});

export const FacilityStatusQuerySchema = object({ branchId: BranchId });
