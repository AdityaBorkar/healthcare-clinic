import {
	AppointmentIdSchema,
	AppointmentListSchema,
	BookAppointmentSchema,
	BookVideoSchema,
	CallNextSchema,
	CancelAppointmentSchema,
	CaptureConsentSchema,
	ComputeSlotsSchema,
	IssueCertificateSchema,
	IssueRecallSchema,
	QueueQuerySchema,
	RescheduleAppointmentSchema,
	WalkinTokenSchema,
} from "@aspen-os/healthcare";
import { minLength, object, optional, pipe, string } from "valibot";

import { scopedAuthMiddleware } from "../middlewares/scoped_auth";

// P0-8 no-show lifecycle: custom to this module (no Aspen equivalent).
// Reason required downstream (cancel workflow), recallAt offers a 1-click
// recall hook. Callers should also set a patient watch flag via
// patients.setFlag after marking no-show.
export const NoShowSchema = object({
	id: pipe(string(), minLength(1, "Appointment ID is required")),
	reason: optional(string(), "no-show"),
	recallAt: optional(string()),
});

export const computeSlots = scopedAuthMiddleware
	.input(ComputeSlotsSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.appointments.computeSlots.run({ input }, { actorId }),
			);
		} catch (error) {
			throw new Error(
				`Slot computation failed (${error instanceof Error ? error.message : "unknown error"}); verify the practitioner schedule and retry`,
			);
		}
	});

export const book = scopedAuthMiddleware
	.input(BookAppointmentSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.appointments.book.run({ input }, { actorId }),
			);
		} catch (error) {
			throw new Error(
				`Booking failed (${error instanceof Error ? error.message : "unknown error"}); verify patient/practitioner/slot and retry`,
			);
		}
	});

export const get = scopedAuthMiddleware
	.input(AppointmentIdSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.appointments.get.run({ input }, { actorId }),
			);
		} catch (error) {
			throw new Error(
				`Appointment lookup failed (${error instanceof Error ? error.message : "unknown error"}); check the ID and retry`,
			);
		}
	});

export const list = scopedAuthMiddleware
	.input(AppointmentListSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.appointments.list.run({ input }, { actorId }),
			);
		} catch (error) {
			throw new Error(
				`Appointment list failed (${error instanceof Error ? error.message : "unknown error"}); retry`,
			);
		}
	});

export const reschedule = scopedAuthMiddleware
	.input(RescheduleAppointmentSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.appointments.reschedule.run({ input }, { actorId }),
			);
		} catch (error) {
			throw new Error(
				`Reschedule failed (${error instanceof Error ? error.message : "unknown error"}); verify the new slot and retry`,
			);
		}
	});

export const cancel = scopedAuthMiddleware
	.input(CancelAppointmentSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.appointments.cancel.run({ input }, { actorId }),
			);
		} catch (error) {
			throw new Error(
				`Cancel failed (${error instanceof Error ? error.message : "unknown error"}); check the ID and retry`,
			);
		}
	});

export const checkin = scopedAuthMiddleware
	.input(AppointmentIdSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.appointments.checkin.run({ input }, { actorId }),
			);
		} catch (error) {
			throw new Error(
				`Check-in failed (${error instanceof Error ? error.message : "unknown error"}); check the ID and retry`,
			);
		}
	});

export const queueBoard = scopedAuthMiddleware
	.input(QueueQuerySchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.appointments.queueBoard.run({ input }, { actorId }),
			);
		} catch (error) {
			throw new Error(
				`Queue board failed (${error instanceof Error ? error.message : "unknown error"}); retry`,
			);
		}
	});

export const walkinToken = scopedAuthMiddleware
	.input(WalkinTokenSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.appointments.walkinToken.run({ input }, { actorId }),
			);
		} catch (error) {
			throw new Error(
				`Walk-in token failed (${error instanceof Error ? error.message : "unknown error"}); retry`,
			);
		}
	});

export const callNext = scopedAuthMiddleware
	.input(CallNextSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.appointments.callNext.run({ input }, { actorId }),
			);
		} catch (error) {
			throw new Error(
				`Call-next failed (${error instanceof Error ? error.message : "unknown error"}); retry`,
			);
		}
	});

export const bookVideo = scopedAuthMiddleware
	.input(BookVideoSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.appointments.bookVideo.run({ input }, { actorId }),
			);
		} catch (error) {
			throw new Error(
				`Video booking failed (${error instanceof Error ? error.message : "unknown error"}); verify patient/practitioner/slot and retry`,
			);
		}
	});

export const captureConsent = scopedAuthMiddleware
	.input(CaptureConsentSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.appointments.captureConsent.run({ input }, { actorId }),
			);
		} catch (error) {
			throw new Error(
				`Consent capture failed (${error instanceof Error ? error.message : "unknown error"}); check the appointment and retry`,
			);
		}
	});

export const issueRecall = scopedAuthMiddleware
	.input(IssueRecallSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.appointments.issueRecall.run({ input }, { actorId }),
			);
		} catch (error) {
			throw new Error(
				`Recall issue failed (${error instanceof Error ? error.message : "unknown error"}); verify the patient and retry`,
			);
		}
	});

export const issueCertificate = scopedAuthMiddleware
	.input(IssueCertificateSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.appointments.issueCertificate.run({ input }, { actorId }),
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
export const markNoShow = scopedAuthMiddleware
	.input(NoShowSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			const cancelled = await pm.run(tenantId, () =>
				pm.healthcare.appointments.cancel.run(
					{
						input: {
							id: input.id,
							reason: `no-show: ${input.reason ?? "patient did not arrive"}`,
						},
					},
					{ actorId },
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
					recall = await pm.run(tenantId, () =>
						pm.healthcare.appointments.issueRecall.run(
							{
								input: {
									at: input.recallAt as string,
									branchId,
									patientId,
									reason: "no-show recall",
								},
							},
							{ actorId },
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
