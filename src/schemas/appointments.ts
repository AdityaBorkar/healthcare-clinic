import { boolean, minLength, object, optional, pipe, string } from "valibot";

const BranchId = optional(string(), "main");
const AppointmentId = pipe(
	string(),
	minLength(1, "Appointment ID is required"),
);

export const BookingSchema = object({
	branchId: BranchId,
	daycare: optional(boolean(), false),
	facilityId: optional(string()),
	note: optional(string()),
	patientId: pipe(string(), minLength(1, "Patient ID is required")),
	practitionerId: pipe(string(), minLength(1, "Practitioner ID is required")),
	pricelist: optional(string(), "standard"),
	serviceId: optional(string()),
	slotStart: pipe(string(), minLength(1, "Slot start is required")),
	tele: optional(boolean(), false),
});

export const AppointmentIdSchema = object({ id: AppointmentId });

export const RescheduleSchema = object({
	id: AppointmentId,
	reason: pipe(string(), minLength(1, "Reschedule reason is required")),
	slotStart: pipe(string(), minLength(1, "New slot start is required")),
});

export const CancelSchema = object({
	id: AppointmentId,
	reason: pipe(string(), minLength(1, "Cancel reason is required")),
});

export const SlotsQuerySchema = object({
	branchId: BranchId,
	date: pipe(string(), minLength(1, "Date is required")),
	practitionerId: pipe(string(), minLength(1, "Practitioner ID is required")),
});

export const QueueQuerySchema = object({ branchId: BranchId });

export const QueueTokenSchema = object({
	branchId: BranchId,
	facilityId: optional(string()),
	patientId: optional(string()),
	practitionerId: optional(string()),
	walkin: optional(boolean(), false),
});

export const CallNextSchema = object({
	branchId: BranchId,
	practitionerId: optional(string()),
});

export const BookVideoSchema = object({
	branchId: BranchId,
	note: optional(string()),
	patientId: pipe(string(), minLength(1, "Patient ID is required")),
	practitionerId: pipe(string(), minLength(1, "Practitioner ID is required")),
	slotStart: pipe(string(), minLength(1, "Slot start is required")),
});

export const ConsentCaptureSchema = object({
	appointmentId: AppointmentId,
	granted: boolean(),
	note: optional(string()),
});

export const RecallIssueSchema = object({
	at: pipe(string(), minLength(1, "Recall date is required")),
	branchId: BranchId,
	patientId: pipe(string(), minLength(1, "Patient ID is required")),
	reason: pipe(string(), minLength(1, "Recall reason is required")),
});

export const CertificateIssueSchema = object({
	appointmentId: AppointmentId,
	body: pipe(string(), minLength(1, "Certificate body is required")),
	branchId: BranchId,
	type: pipe(string(), minLength(1, "Certificate type is required")),
});

export const AppointmentListSchema = object({ branchId: BranchId });
