import {
	array,
	minLength,
	number,
	object,
	optional,
	picklist,
	pipe,
	string,
} from "valibot";

const BranchId = optional(string(), "main");
const Id = pipe(string(), minLength(1, "ID is required"));

export const TestMasterSchema = object({
	branchId: BranchId,
	code: pipe(string(), minLength(1, "Test code is required")),
	name: pipe(string(), minLength(1, "Test name is required")),
	price: optional(number()),
	specimen: optional(string()),
	turnaroundHrs: optional(number()),
});

export const PanelSchema = object({
	branchId: BranchId,
	name: pipe(string(), minLength(1, "Panel name is required")),
	testIds: array(Id),
});

export const OrderLabsSchema = object({
	branchId: BranchId,
	dx: optional(string()),
	encounterId: optional(string()),
	patientId: Id,
	payer: optional(string()),
	priority: picklist(["routine", "urgent", "stat"]),
	tests: array(Id),
});

export const SampleCollectSchema = object({
	barcode: pipe(string(), minLength(1, "Barcode is required")),
	branchId: BranchId,
	collectedAt: optional(string()),
	collectedBy: Id,
	orderId: Id,
});

export const ResultEntrySchema = object({
	branchId: BranchId,
	enteredBy: Id,
	flag: optional(picklist(["normal", "L", "H", "critical"])),
	orderId: Id,
	testCode: Id,
	value: pipe(string(), minLength(1, "Result value is required")),
});

export const CriticalAckSchema = object({
	ackBy: Id,
	branchId: BranchId,
	note: optional(string()),
	orderId: Id,
	testCode: Id,
});

export const AuthorizeSchema = object({
	authorizedBy: Id,
	branchId: BranchId,
	orderId: Id,
	role: pipe(string(), minLength(1, "Authorizer role is required")),
});

export const DeliverSchema = object({
	branchId: BranchId,
	channel: optional(picklist(["print", "whatsapp", "email", "portal"])),
	orderId: Id,
});

export const RadioBookSchema = object({
	branchId: BranchId,
	patientId: Id,
	referredBy: optional(string()),
	service: pipe(string(), minLength(1, "Service is required")),
	slot: pipe(string(), minLength(1, "Slot is required")),
});

export const RadioRescheduleSchema = object({
	bookingId: Id,
	branchId: BranchId,
	newSlot: pipe(string(), minLength(1, "New slot is required")),
	reason: optional(string()),
	supervisorOverrideBy: optional(string()),
});

export const RadioCheckinSchema = object({
	bookingId: Id,
	branchId: BranchId,
});

export const RadioReportAttachSchema = object({
	bookingId: Id,
	branchId: BranchId,
	impression: optional(string()),
	reportPath: pipe(string(), minLength(1, "Report path is required")),
});

export const RadioAuthorizeSchema = object({
	authorizedBy: Id,
	bookingId: Id,
	branchId: BranchId,
});

export const QcLogSchema = object({
	branchId: BranchId,
	equipment: pipe(string(), minLength(1, "Equipment is required")),
	loggedBy: Id,
	param: pipe(string(), minLength(1, "Parameter is required")),
	status: picklist(["pass", "fail"]),
	value: string(),
});

export const CancelOrderSchema = object({
	bookingId: optional(string()),
	branchId: BranchId,
	cancelledBy: Id,
	orderId: optional(string()),
	reason: pipe(string(), minLength(1, "Cancel reason is required")),
});

export const DiagnosticsIdSchema = object({
	branchId: BranchId,
	id: Id,
});
