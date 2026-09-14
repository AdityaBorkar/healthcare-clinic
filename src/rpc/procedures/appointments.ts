import {
	AppointmentIdSchema,
	AppointmentListSchema,
	BookingSchema,
	BookVideoSchema,
	CallNextSchema,
	CancelSchema,
	CertificateIssueSchema,
	ConsentCaptureSchema,
	QueueQuerySchema,
	QueueTokenSchema,
	RecallIssueSchema,
	RescheduleSchema,
	SlotsQuerySchema,
} from "#/schemas/appointments";
import { authed } from "../middlewares/auth";
import { requireOrganizationSlug } from "../utils/subdomain";
import { resolveTenantDatabaseName } from "../utils/workspace-organization";

export const computeSlots = authed
	.input(SlotsQuerySchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		try {
			return await pm.run(dbName, () =>
				pm.healthcare.appointments.computeSlots.run(
					{
						input: {
							branchId: input.branchId,
							date: input.date,
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

export const book = authed
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

export const get = authed
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

export const list = authed
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

export const reschedule = authed
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

export const cancel = authed
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

export const checkin = authed
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

export const queueBoard = authed
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

export const walkinToken = authed
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

export const callNext = authed
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

export const bookVideo = authed
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

export const captureConsent = authed
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

export const issueRecall = authed
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

export const issueCertificate = authed
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
