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
const ServiceId = pipe(string(), minLength(1, "Service ID is required"));

// Payer mix for OPD/clinic (cash-first; no insurance in this tier).
export const ServicePayerSchema = picklist([
	"cash",
	"card",
	"upi",
	"corporate",
]);

export const ServiceCreateSchema = object({
	active: optional(boolean(), true),
	basePrice: optional(number()),
	billingCode: optional(string()),
	branchId: BranchId,
	code: pipe(string(), minLength(1, "Service code is required")),
	codeSystem: optional(picklist(["CPT", "ICD-11", "internal"])),
	department: optional(string()),
	durationMin: optional(pipe(number(), integer(), minValue(1))),
	gstPct: optional(pipe(number(), minValue(0))),
	modality: optional(string()),
	name: NameSchema,
	pathy: optional(string()),
	payer: optional(ServicePayerSchema, "cash"),
	teleExempt: optional(boolean(), false),
});

export const ServiceIdSchema = object({ id: ServiceId });

export const ServicePatchSchema = object({
	id: ServiceId,
	patch: object({
		active: optional(boolean()),
		basePrice: optional(number()),
		billingCode: optional(string()),
		codeSystem: optional(picklist(["CPT", "ICD-11", "internal"])),
		department: optional(string()),
		durationMin: optional(pipe(number(), integer(), minValue(1))),
		gstPct: optional(pipe(number(), minValue(0))),
		modality: optional(string()),
		name: optional(NameSchema),
		pathy: optional(string()),
		payer: optional(ServicePayerSchema),
		teleExempt: optional(boolean()),
	}),
});

export const ServiceListSchema = object({
	branchId: BranchId,
	department: optional(string()),
	pathy: optional(string()),
	search: optional(string()),
	status: optional(string()),
});

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
	approver: optional(string()),
	branchId: BranchId,
	code: optional(string()),
	maxPct: optional(pipe(number(), minValue(0))),
	minQty: optional(pipe(number(), integer(), minValue(1))),
	pct: pipe(number(), minValue(0)),
	serviceId: optional(string()),
});

export const PackageDefSchema = object({
	branchId: BranchId,
	name: NameSchema,
	price: number(),
	scope: optional(string()),
	serviceIds: array(pipe(string(), minLength(1))),
	sessions: optional(pipe(number(), integer(), minValue(1))),
	validityDays: optional(pipe(number(), integer(), minValue(1))),
});

// Every invoice must carry >= 1 billing code (CPT/ICD-11/internal).
export const INVOICE_MIN_CODES_NOTE =
	"Every invoice must carry at least one billing code (CPT/ICD-11/internal).";

export const RedeemSchema = object({
	branchId: BranchId,
	packageId: pipe(string(), minLength(1, "Package ID is required")),
	patientId: pipe(string(), minLength(1, "Patient ID is required")),
});
