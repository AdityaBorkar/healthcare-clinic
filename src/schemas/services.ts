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
	billingUomCategory: optional(picklist(["count", "session"])),
	billingUomId: optional(string()),
	branchId: BranchId,
	code: pipe(string(), minLength(1, "Service code is required")),
	codeSystem: optional(picklist(["CPT", "ICD-11", "internal"])),
	department: optional(string()),
	durationMin: optional(pipe(number(), integer(), minValue(1))),
	durationUomCategory: optional(picklist(["time"])),
	durationUomId: optional(string()),
	durationValue: optional(pipe(number(), minValue(0))),
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
		billingUomCategory: optional(picklist(["count", "session"])),
		billingUomId: optional(string()),
		codeSystem: optional(picklist(["CPT", "ICD-11", "internal"])),
		department: optional(string()),
		durationMin: optional(pipe(number(), integer(), minValue(1))),
		durationUomCategory: optional(picklist(["time"])),
		durationUomId: optional(string()),
		durationValue: optional(pipe(number(), minValue(0))),
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
	gstPct: optional(pipe(number(), minValue(0))),
	pricelist: optional(string(), "standard"),
	pricelistId: optional(string()),
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

export const PricelistCreateSchema = object({
	branchId: BranchId,
	code: pipe(string(), minLength(1, "Pricelist code is required")),
	currency: optional(string(), "INR"),
	name: NameSchema,
	payer: optional(string()),
	scope: optional(picklist(["global", "branch"]), "branch"),
	taxInclusive: optional(boolean(), true),
});

export const PricelistIdSchema = object({
	id: pipe(string(), minLength(1, "Pricelist ID is required")),
});

export const PricelistPatchSchema = object({
	id: pipe(string(), minLength(1, "Pricelist ID is required")),
	patch: object({
		currency: optional(string()),
		name: optional(NameSchema),
		payer: optional(string()),
		scope: optional(picklist(["global", "branch"])),
		taxInclusive: optional(boolean()),
	}),
});

export const PricelistListSchema = object({
	branchId: BranchId,
	payer: optional(string()),
	search: optional(string()),
	status: optional(string()),
});

export const PricelistPublishSchema = object({
	effectiveFrom: optional(string()),
	effectiveTo: optional(string()),
	id: pipe(string(), minLength(1, "Pricelist ID is required")),
});

export const PriceResolveSchema = object({
	branchId: BranchId,
	date: optional(string()),
	payer: optional(string()),
	pricelistId: optional(string()),
	serviceId: ServiceId,
});

export const BulkRevisionPreviewSchema = object({
	branchId: BranchId,
	pricelistId: pipe(string(), minLength(1, "Pricelist ID is required")),
	rows: optional(
		array(
			object({
				amount: pipe(number(), minValue(0)),
				serviceId: ServiceId,
			}),
		),
	),
	upliftPct: optional(number()),
});

export const BulkRevisionApplySchema = object({
	approvedBy: pipe(string(), minLength(1, "Approver is required")),
	branchId: BranchId,
	effectiveFrom: pipe(string(), minLength(1, "Effective date is required")),
	pricelistId: pipe(string(), minLength(1, "Pricelist ID is required")),
	requestedBy: pipe(string(), minLength(1, "Requester is required")),
	rows: optional(
		array(
			object({
				amount: pipe(number(), minValue(0)),
				serviceId: ServiceId,
			}),
		),
	),
	upliftPct: optional(number()),
});

export const RedeemSchema = object({
	branchId: BranchId,
	packageId: pipe(string(), minLength(1, "Package ID is required")),
	patientId: pipe(string(), minLength(1, "Patient ID is required")),
});
