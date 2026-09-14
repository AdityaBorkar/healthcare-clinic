import {
	array,
	boolean,
	minLength,
	number,
	object,
	optional,
	pipe,
	string,
} from "valibot";

import { NameSchema } from "#/schemas/common";

const BranchId = optional(string(), "main");
const ServiceId = pipe(string(), minLength(1, "Service ID is required"));

export const ServiceCreateSchema = object({
	basePrice: optional(number()),
	branchId: BranchId,
	code: pipe(string(), minLength(1, "Service code is required")),
	name: NameSchema,
	teleExempt: optional(boolean(), false),
});

export const ServiceIdSchema = object({ id: ServiceId });

export const ServicePatchSchema = object({
	id: ServiceId,
	patch: object({
		basePrice: optional(number()),
		name: optional(NameSchema),
		teleExempt: optional(boolean()),
	}),
});

export const ServiceListSchema = object({ branchId: BranchId });

export const FacilityMapSchema = object({
	branchId: BranchId,
	facilityId: pipe(string(), minLength(1, "Facility ID is required")),
	serviceId: ServiceId,
});

export const PriceSchema = object({
	amount: number(),
	branchId: BranchId,
	effectiveFrom: optional(string()),
	pricelist: optional(string(), "standard"),
	serviceId: ServiceId,
});

export const DiscountRuleSchema = object({
	branchId: BranchId,
	code: optional(string()),
	minQty: optional(number()),
	pct: number(),
	serviceId: optional(string()),
});

export const PackageDefSchema = object({
	branchId: BranchId,
	name: NameSchema,
	price: number(),
	serviceIds: array(pipe(string(), minLength(1))),
});

export const RedeemSchema = object({
	branchId: BranchId,
	packageId: pipe(string(), minLength(1, "Package ID is required")),
	patientId: pipe(string(), minLength(1, "Patient ID is required")),
});
