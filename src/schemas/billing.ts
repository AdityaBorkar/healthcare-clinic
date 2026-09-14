import {
	array,
	boolean,
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

const InvoiceLineSchema = object({
	price: pipe(number(), minValue(0)),
	qty: pipe(number(), minValue(1)),
	serviceId: Id,
	source: picklist([
		"pharmacy",
		"diagnostics",
		"consult",
		"package",
		"stay",
		"procedure",
	]),
});

export const InvoiceFromSourcesSchema = object({
	branchId: BranchId,
	discountPct: optional(pipe(number(), minValue(0), maxValue(100))),
	encounterId: optional(string()),
	gstPct: optional(pipe(number(), minValue(0), maxValue(100))),
	lines: array(InvoiceLineSchema),
	patientId: Id,
	payer: optional(string()),
});

export const InvoiceFinalizeSchema = object({
	branchId: BranchId,
	invoiceId: Id,
});

export const InterimTabSchema = object({
	branchId: BranchId,
	episodeId: optional(string()),
	patientId: Id,
});

export const DiscountSchema = object({
	approver: optional(string()),
	branchId: BranchId,
	discountPct: pipe(number(), minValue(0), maxValue(100)),
	invoiceId: Id,
	requestedBy: Id,
});

const PayLineSchema = object({
	amount: pipe(number(), minValue(0)),
	mode: picklist(["cash", "upi", "card", "cheque", "neft"]),
	ref: optional(string()),
});

export const PaySchema = object({
	amount: pipe(number(), minValue(0)),
	branchId: BranchId,
	episodeId: optional(string()),
	invoiceId: Id,
	isAdvance: optional(boolean()),
	lines: optional(array(PayLineSchema)),
	mode: picklist(["cash", "upi", "card", "cheque", "neft"]),
	ref: optional(string()),
});

export const PackageSellSchema = object({
	branchId: BranchId,
	packageId: Id,
	patientId: Id,
	price: pipe(number(), minValue(0)),
	validityDays: optional(pipe(number(), minValue(1))),
});

export const RedeemSchema = object({
	branchId: BranchId,
	packageSaleId: Id,
	qty: optional(pipe(number(), minValue(1)), 1),
	serviceId: Id,
});

export const PricelistSchema = object({
	branchId: BranchId,
	name: pipe(string(), minLength(1, "Pricelist name is required")),
	rates: array(
		object({
			price: pipe(number(), minValue(0)),
			serviceId: Id,
		}),
	),
});

export const RepriceSchema = object({
	branchId: BranchId,
	invoiceId: Id,
	pricelistId: Id,
});

export const BillingCndnSchema = object({
	amount: pipe(number(), minValue(0)),
	approver: Id,
	branchId: BranchId,
	invoiceId: Id,
	kind: picklist(["CN", "DN"]),
	reason: pipe(string(), minLength(1, "Reason is required")),
});

export const SettleAdvanceSchema = object({
	amount: pipe(number(), minValue(0)),
	branchId: BranchId,
	direction: picklist(["receive", "adjust"]),
	episodeId: optional(string()),
	patientId: Id,
});

export const DuesAgingSchema = object({
	asOf: optional(string()),
	branchId: BranchId,
});

export const CollectionReportSchema = object({
	branchId: BranchId,
	desk: optional(string()),
	from: optional(string()),
	to: optional(string()),
});

export const PackageLiabilitySchema = object({
	branchId: BranchId,
	includeExpired: optional(boolean()),
});

export const GstExportSchema = object({
	branchId: BranchId,
	month: optional(string()),
});

export const BillingIdSchema = object({
	branchId: BranchId,
	id: Id,
});
