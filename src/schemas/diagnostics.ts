import {
	array,
	boolean,
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

const ReferenceRangeSchema = object({
	ageMax: optional(number()),
	ageMin: optional(number()),
	high: number(),
	low: number(),
	sex: optional(picklist(["M", "F", "any"])),
});

export const TestMasterSchema = object({
	active: optional(boolean()),
	branchId: BranchId,
	code: pipe(string(), minLength(1, "Test code is required")),
	method: optional(string()),
	name: pipe(string(), minLength(1, "Test name is required")),
	price: optional(number()),
	ranges: optional(array(ReferenceRangeSchema)),
	refHigh: optional(number()),
	refLow: optional(number()),
	specimen: optional(string()),
	turnaroundHrs: optional(number()),
	units: optional(string()),
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

export const SampleReceiveSchema = object({
	barcode: pipe(string(), minLength(1, "Barcode is required")),
	branchId: BranchId,
	condition: optional(
		picklist(["ok", "hemolysed", "insufficient", "clotted", "mislabeled"]),
	),
	receivedAt: optional(string()),
	receivedBy: Id,
});

export const SampleRejectSchema = object({
	barcode: pipe(string(), minLength(1, "Barcode is required")),
	branchId: BranchId,
	note: optional(string()),
	reason: picklist([
		"hemolysed",
		"insufficient",
		"clotted",
		"mislabeled",
		"other",
	]),
	rejectedBy: Id,
});

export const AddOnTestSchema = object({
	branchId: BranchId,
	orderId: Id,
	requestedBy: Id,
	tests: array(Id),
});

export const ProcessingStartSchema = object({
	branchId: BranchId,
	orderId: Id,
	startedBy: Id,
});

export const TatReportSchema = object({
	branchId: BranchId,
	from: optional(string()),
	limit: optional(number()),
	to: optional(string()),
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
	deviations: optional(string()),
	equipment: pipe(string(), minLength(1, "Equipment is required")),
	loggedBy: Id,
	param: pipe(string(), minLength(1, "Parameter is required")),
	reagentLots: optional(array(string())),
	status: picklist(["pass", "flag", "fail"]),
	testFamily: optional(string()),
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
