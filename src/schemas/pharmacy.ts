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
const Qty = pipe(number(), minValue(1, "Quantity must be positive"));

export const ItemUpsertSchema = object({
	branchId: BranchId,
	coldChain: optional(boolean()),
	gstPct: optional(pipe(number(), minValue(0), maxValue(100))),
	hsn: optional(string()),
	name: pipe(string(), minLength(1, "Item name is required")),
	pack: pipe(string(), minLength(1, "Pack is required")),
	reorderLevel: optional(pipe(number(), minValue(0))),
	salt: pipe(string(), minLength(1, "Salt is required")),
	schedule: picklist(["H", "H1", "X", "OTC"]),
	strength: pipe(string(), minLength(1, "Strength is required")),
});

export const BatchReceiveSchema = object({
	branchId: BranchId,
	expiry: pipe(string(), minLength(1, "Expiry is required")),
	itemId: Id,
	lot: pipe(string(), minLength(1, "Lot number is required")),
	mrp: pipe(number(), minValue(0)),
	qty: Qty,
	rate: pipe(number(), minValue(0)),
	store: optional(string(), "main-store"),
});

export const SaleFromRxSchema = object({
	branchId: BranchId,
	fefoOverrideReason: optional(string()),
	items: array(
		object({
			batchId: optional(string()),
			itemId: Id,
			qty: Qty,
			substituteOf: optional(string()),
			substituteReason: optional(string()),
		}),
	),
	mode: picklist(["cash", "upi", "card", "credit"]),
	patientId: Id,
	prescriptionId: optional(string()),
});

export const PartialCloseSchema = object({
	amount: pipe(number(), minValue(0)),
	branchId: BranchId,
	mode: picklist(["cash", "upi", "card", "cheque", "neft"]),
	saleId: Id,
});

export const ReturnSchema = object({
	branchId: BranchId,
	items: array(
		object({
			batchId: optional(string()),
			disposition: optional(picklist(["restock", "quarantine"])),
			itemId: Id,
			qty: Qty,
		}),
	),
	originalBillId: Id,
	reason: pipe(string(), minLength(1, "Return reason is required")),
});

export const PoCreateSchema = object({
	branchId: BranchId,
	items: array(
		object({
			itemId: Id,
			qty: Qty,
		}),
	),
	note: optional(string()),
	vendor: pipe(string(), minLength(1, "Vendor is required")),
});

export const GrnVerifySchema = object({
	branchId: BranchId,
	damagedQty: optional(pipe(number(), minValue(0))),
	note: optional(string()),
	poId: Id,
	received: array(
		object({
			damagedQty: optional(pipe(number(), minValue(0))),
			itemId: Id,
			qty: pipe(number(), minValue(0)),
			shortQty: optional(pipe(number(), minValue(0))),
		}),
	),
	shortQty: optional(pipe(number(), minValue(0))),
	verifiedBy: Id,
});

export const PiBookSchema = object({
	amount: pipe(number(), minValue(0)),
	branchId: BranchId,
	grnId: Id,
	gstAmount: optional(pipe(number(), minValue(0))),
	invoiceNo: pipe(string(), minLength(1, "Vendor invoice number is required")),
});

export const PharmacyCndnSchema = object({
	amount: pipe(number(), minValue(0)),
	approver: Id,
	branchId: BranchId,
	kind: picklist(["CN", "DN"]),
	reason: pipe(string(), minLength(1, "Reason is required")),
	refId: Id,
	refType: picklist(["po", "pi", "sale"]),
});

export const TransferSchema = object({
	batchId: optional(string()),
	branchId: BranchId,
	from: optional(string(), "store"),
	itemId: Id,
	note: optional(string()),
	qty: Qty,
	to: picklist(["ward", "daycare", "store"]),
});

export const TransferAcceptSchema = object({
	acceptedBy: Id,
	branchId: BranchId,
	decision: optional(picklist(["accept", "reject"]), "accept"),
	reason: optional(string()),
	transferId: Id,
});

export const ReorderSuggestSchema = object({
	branchId: BranchId,
	store: optional(string()),
});

export const ExpiryAlertQuerySchema = object({
	branchId: BranchId,
	store: optional(string()),
	withinDays: optional(pipe(number(), minValue(1)), 90),
});

export const StockLedgerQuerySchema = object({
	branchId: BranchId,
	itemId: optional(string()),
	limit: optional(pipe(number(), minValue(1))),
	store: optional(string()),
});

export const StockCorrectSchema = object({
	batchId: Id,
	branchId: BranchId,
	correctedBy: Id,
	deltaQty: pipe(number()),
	reason: pipe(string(), minLength(1, "Correction reason is required")),
});

export const PharmacyIdSchema = object({
	branchId: BranchId,
	id: Id,
});
