import {
	AppointmentIdSchema,
	AppointmentListSchema,
	BookingSchema,
	BookVideoSchema,
	CallNextSchema,
	CancelSchema,
	CertificateIssueSchema,
	ConsentCaptureSchema,
	NoShowSchema,
	QueueQuerySchema,
	QueueTokenSchema,
	RecallIssueSchema,
	RescheduleSchema,
	SlotsQuerySchema,
} from "#/schemas/appointments";
import { authMiddleware } from "../middlewares/auth";
import { requireOrganizationSlug } from "../utils/subdomain";
import { resolveTenantDatabaseName } from "../utils/workspace-organization";

export const computeSlots = authMiddleware
	.input(SlotsQuerySchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		try {
			// Aspen ComputeSlots supports branchId/date/practitionerId/facilityId.
			// serviceId/durationMin/bufferMin are validated locally (P0-10) and
			// kept for slot-length display until the backend accepts them.
			return await pm.run(dbName, () =>
				pm.healthcare.appointments.computeSlots.run(
					{
						input: {
							branchId: input.branchId,
							date: input.date,
							...(input.facilityId ? { facilityId: input.facilityId } : {}),
							practitionerId: input.practitionerId,
						},
					},
					{ actorId: context.session.user.id },
				),
			);
		} catch (error) {
			throw new Error(
				`Slot computation failed (${error instanceof Error ? error.message : "unknown error"}); verify the practitioner schedule and retry`,
			);
		}
	});

export const book = authMiddleware
	.input(BookingSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		try {
			return await pm.run(dbName, () =>
				pm.healthcare.appointments.book.run(
					{
						input: {
							branchId: input.branchId,
							daycare: input.daycare,
							facilityId: input.facilityId,
							note: input.note,
							patientId: input.patientId,
							practitionerId: input.practitionerId,
							pricelist: input.pricelist,
							serviceId: input.serviceId,
							slotStart: input.slotStart,
						},
					},
					{ actorId: context.session.user.id },
				),
			);
		} catch (error) {
			throw new Error(
				`Booking failed (${error instanceof Error ? error.message : "unknown error"}); verify patient/practitioner/slot and retry`,
			);
		}
	});

export const get = authMiddleware
	.input(AppointmentIdSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		try {
			return await pm.run(dbName, () =>
				pm.healthcare.appointments.get.run(
					{ input: { id: input.id } },
					{ actorId: context.session.user.id },
				),
			);
		} catch (error) {
			throw new Error(
				`Appointment lookup failed (${error instanceof Error ? error.message : "unknown error"}); check the ID and retry`,
			);
		}
	});

export const list = authMiddleware
	.input(AppointmentListSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		try {
			return await pm.run(dbName, () =>
				pm.healthcare.appointments.list.run(
					{ input: { branchId: input.branchId } },
					{ actorId: context.session.user.id },
				),
			);
		} catch (error) {
			throw new Error(
				`Appointment list failed (${error instanceof Error ? error.message : "unknown error"}); retry`,
			);
		}
	});

export const reschedule = authMiddleware
	.input(RescheduleSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		try {
			return await pm.run(dbName, () =>
				pm.healthcare.appointments.reschedule.run(
					{
						input: {
							id: input.id,
							reason: input.reason,
							slotStart: input.slotStart,
						},
					},
					{ actorId: context.session.user.id },
				),
			);
		} catch (error) {
			throw new Error(
				`Reschedule failed (${error instanceof Error ? error.message : "unknown error"}); verify the new slot and retry`,
			);
		}
	});

export const cancel = authMiddleware
	.input(CancelSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		try {
			return await pm.run(dbName, () =>
				pm.healthcare.appointments.cancel.run(
					{ input: { id: input.id, reason: input.reason } },
					{ actorId: context.session.user.id },
				),
			);
		} catch (error) {
			throw new Error(
				`Cancel failed (${error instanceof Error ? error.message : "unknown error"}); check the ID and retry`,
			);
		}
	});

export const checkin = authMiddleware
	.input(AppointmentIdSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		try {
			return await pm.run(dbName, () =>
				pm.healthcare.appointments.checkin.run(
					{ input: { id: input.id } },
					{ actorId: context.session.user.id },
				),
			);
		} catch (error) {
			throw new Error(
				`Check-in failed (${error instanceof Error ? error.message : "unknown error"}); check the ID and retry`,
			);
		}
	});

export const queueBoard = authMiddleware
	.input(QueueQuerySchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		try {
			return await pm.run(dbName, () =>
				pm.healthcare.appointments.queueBoard.run(
					{ input: { branchId: input.branchId } },
					{ actorId: context.session.user.id },
				),
			);
		} catch (error) {
			throw new Error(
				`Queue board failed (${error instanceof Error ? error.message : "unknown error"}); retry`,
			);
		}
	});

export const walkinToken = authMiddleware
	.input(QueueTokenSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		try {
			return await pm.run(dbName, () =>
				pm.healthcare.appointments.walkinToken.run(
					{
						input: {
							branchId: input.branchId,
							facilityId: input.facilityId,
							patientId: input.patientId,
							practitionerId: input.practitionerId,
							walkin: input.walkin,
						},
					},
					{ actorId: context.session.user.id },
				),
			);
		} catch (error) {
			throw new Error(
				`Walk-in token failed (${error instanceof Error ? error.message : "unknown error"}); retry`,
			);
		}
	});

export const callNext = authMiddleware
	.input(CallNextSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		try {
			return await pm.run(dbName, () =>
				pm.healthcare.appointments.callNext.run(
					{
						input: {
							branchId: input.branchId,
							practitionerId: input.practitionerId,
						},
					},
					{ actorId: context.session.user.id },
				),
			);
		} catch (error) {
			throw new Error(
				`Call-next failed (${error instanceof Error ? error.message : "unknown error"}); retry`,
			);
		}
	});

export const bookVideo = authMiddleware
	.input(BookVideoSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		try {
			return await pm.run(dbName, () =>
				pm.healthcare.appointments.bookVideo.run(
					{
						input: {
							branchId: input.branchId,
							note: input.note,
							patientId: input.patientId,
							practitionerId: input.practitionerId,
							slotStart: input.slotStart,
						},
					},
					{ actorId: context.session.user.id },
				),
			);
		} catch (error) {
			throw new Error(
				`Video booking failed (${error instanceof Error ? error.message : "unknown error"}); verify patient/practitioner/slot and retry`,
			);
		}
	});

export const captureConsent = authMiddleware
	.input(ConsentCaptureSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		try {
			return await pm.run(dbName, () =>
				pm.healthcare.appointments.captureConsent.run(
					{
						input: {
							appointmentId: input.appointmentId,
							granted: input.granted,
							note: input.note,
						},
					},
					{ actorId: context.session.user.id },
				),
			);
		} catch (error) {
			throw new Error(
				`Consent capture failed (${error instanceof Error ? error.message : "unknown error"}); check the appointment and retry`,
			);
		}
	});

export const issueRecall = authMiddleware
	.input(RecallIssueSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		try {
			return await pm.run(dbName, () =>
				pm.healthcare.appointments.issueRecall.run(
					{
						input: {
							at: input.at,
							branchId: input.branchId,
							patientId: input.patientId,
							reason: input.reason,
						},
					},
					{ actorId: context.session.user.id },
				),
			);
		} catch (error) {
			throw new Error(
				`Recall issue failed (${error instanceof Error ? error.message : "unknown error"}); verify the patient and retry`,
			);
		}
	});

export const issueCertificate = authMiddleware
	.input(CertificateIssueSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		try {
			return await pm.run(dbName, () =>
				pm.healthcare.appointments.issueCertificate.run(
					{
						input: {
							appointmentId: input.appointmentId,
							body: input.body,
							branchId: input.branchId,
							type: input.type,
						},
					},
					{ actorId: context.session.user.id },
				),
			);
		} catch (error) {
			throw new Error(
				`Certificate issue failed (${error instanceof Error ? error.message : "unknown error"}); verify the appointment and retry`,
			);
		}
	});

// P0-8 no-show lifecycle. No dedicated Aspen workflow exists yet, so this
// reuses the cancel workflow with a "no-show:" reason prefix (status ends as
// cancelled with the reason preserved in payload). When recallAt is provided
// it also issues a recall in the same request (1-click recall hook).
// Auto-flag note: callers should follow with patients.setFlag
// (level "watch", label "no-show") so repeat no-shows surface on the queue.
export const markNoShow = authMiddleware
	.input(NoShowSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		try {
			const cancelled = await pm.run(dbName, () =>
				pm.healthcare.appointments.cancel.run(
					{
						input: {
							id: input.id,
							reason: `no-show: ${input.reason ?? "patient did not arrive"}`,
						},
					},
					{ actorId: context.session.user.id },
				),
			);
			let recall: unknown = null;
			if (input.recallAt) {
				const patientId =
					(cancelled as { patientId?: string } | null)?.patientId ??
					(cancelled as { patient_id?: string } | null)?.patient_id;
				if (patientId) {
					const branchId =
						(cancelled as { branchId?: string } | null)?.branchId ?? "main";
					recall = await pm.run(dbName, () =>
						pm.healthcare.appointments.issueRecall.run(
							{
								input: {
									at: input.recallAt as string,
									branchId,
									patientId,
									reason: "no-show recall",
								},
							},
							{ actorId: context.session.user.id },
						),
					);
				}
			}
			return { appointment: cancelled, recall };
		} catch (error) {
			throw new Error(
				`Mark-no-show failed (${error instanceof Error ? error.message : "unknown error"}); check the ID and retry`,
			);
		}
	});
