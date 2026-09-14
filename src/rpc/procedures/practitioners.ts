import {
	ConflictQuerySchema,
	EducationSchema,
	FeeSchema,
	LeaveBlockSchema,
	NextSlotQuerySchema,
	PostingSchema,
	PractitionerCreateSchema,
	PractitionerIdSchema,
	PractitionerListSchema,
	PractitionerPatchSchema,
	RegistrationSchema,
	ScheduleSchema,
} from "#/schemas/practitioners";
import { scopedAuthMiddleware } from "../middlewares/scoped_auth";

export const create = scopedAuthMiddleware
	.input(PractitionerCreateSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			// Backend create accepts branchId/email/languages/name/overallYrs/
			// phone/specialistYrs/specialty only; photo/bio/signature/board/
			// fees/presence are kept client-side until the backend grows them.
			// Multi-specialization: first entry doubles as legacy specialty.
			return await pm.run(tenantId, () =>
				pm.healthcare.practitioners.create.run(
					{
						input: {
							branchId: input.branchId,
							email: input.email,
							languages: input.languages,
							name: input.name,
							overallYrs: input.overallYrs,
							phone: input.phone,
							specialistYrs: input.specialistYrs,
							specialty:
								input.specialty ?? input.specializations?.[0] ?? undefined,
						},
					},
					{ actorId },
				),
			);
		} catch (error) {
			throw new Error(
				`Practitioner creation failed (${error instanceof Error ? error.message : "unknown error"}); verify the details and retry`,
			);
		}
	});

export const get = scopedAuthMiddleware
	.input(PractitionerIdSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.practitioners.get.run(
					{ input: { id: input.id } },
					{ actorId },
				),
			);
		} catch (error) {
			throw new Error(
				`Practitioner lookup failed (${error instanceof Error ? error.message : "unknown error"}); check the ID and retry`,
			);
		}
	});

export const list = scopedAuthMiddleware
	.input(PractitionerListSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			// Backend list accepts branchId only; search/specialty filters are
			// applied client-side in the admin UI until backend filters land.
			return await pm.run(tenantId, () =>
				pm.healthcare.practitioners.list.run(
					{ input: { branchId: input.branchId } },
					{ actorId },
				),
			);
		} catch (error) {
			throw new Error(
				`Practitioner list failed (${error instanceof Error ? error.message : "unknown error"}); retry`,
			);
		}
	});

export const update = scopedAuthMiddleware
	.input(PractitionerPatchSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			// Strip client-only patch keys (photo/bio/signature/board/fees/
			// presence/specializations) before the backend update call.
			const { patch } = input;
			return await pm.run(tenantId, () =>
				pm.healthcare.practitioners.update.run(
					{
						input: {
							id: input.id,
							patch: {
								...(patch.email !== undefined ? { email: patch.email } : {}),
								...(patch.languages !== undefined
									? { languages: patch.languages }
									: {}),
								...(patch.name !== undefined ? { name: patch.name } : {}),
								...(patch.overallYrs !== undefined
									? { overallYrs: patch.overallYrs }
									: {}),
								...(patch.phone !== undefined ? { phone: patch.phone } : {}),
								...(patch.specialistYrs !== undefined
									? { specialistYrs: patch.specialistYrs }
									: {}),
								...(patch.specialty !== undefined
									? { specialty: patch.specialty }
									: patch.specializations?.[0] !== undefined
										? { specialty: patch.specializations[0] }
										: {}),
							},
						},
					},
					{ actorId },
				),
			);
		} catch (error) {
			throw new Error(
				`Practitioner update failed (${error instanceof Error ? error.message : "unknown error"}); check the ID and retry`,
			);
		}
	});

export const deactivate = scopedAuthMiddleware
	.input(PractitionerIdSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.practitioners.deactivate.run(
					{ input: { id: input.id } },
					{ actorId },
				),
			);
		} catch (error) {
			throw new Error(
				`Practitioner deactivation failed (${error instanceof Error ? error.message : "unknown error"}); check the ID and retry`,
			);
		}
	});

export const addRegistration = scopedAuthMiddleware
	.input(RegistrationSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			// renewalDate is tracked client-side until the backend schema grows it.
			return await pm.run(tenantId, () =>
				pm.healthcare.practitioners.addRegistration.run(
					{
						input: {
							branchId: input.branchId,
							council: input.council,
							practitionerId: input.practitionerId,
							regNo: input.regNo,
							year: input.year,
						},
					},
					{ actorId },
				),
			);
		} catch (error) {
			throw new Error(
				`Registration save failed (${error instanceof Error ? error.message : "unknown error"}); verify the practitioner and retry`,
			);
		}
	});

export const addEducation = scopedAuthMiddleware
	.input(EducationSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.practitioners.addEducation.run(
					{
						input: {
							branchId: input.branchId,
							degree: input.degree,
							institute: input.institute,
							practitionerId: input.practitionerId,
							year: input.year,
						},
					},
					{ actorId },
				),
			);
		} catch (error) {
			throw new Error(
				`Education save failed (${error instanceof Error ? error.message : "unknown error"}); verify the practitioner and retry`,
			);
		}
	});

export const addPosting = scopedAuthMiddleware
	.input(PostingSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.practitioners.addPosting.run(
					{
						input: {
							branchId: input.branchId,
							facilityId: input.facilityId,
							from: input.from,
							practitionerId: input.practitionerId,
							to: input.to,
						},
					},
					{ actorId },
				),
			);
		} catch (error) {
			throw new Error(
				`Posting save failed (${error instanceof Error ? error.message : "unknown error"}); verify the practitioner and retry`,
			);
		}
	});

export const setSchedule = scopedAuthMiddleware
	.input(ScheduleSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.practitioners.setSchedule.run(
					{
						input: {
							branchId: input.branchId,
							bufferMin: input.bufferMin,
							emergencyCount: input.emergencyCount,
							end: input.end,
							facilityId: input.facilityId,
							practitionerId: input.practitionerId,
							slotMin: input.slotMin,
							start: input.start,
							videoFlag: input.videoFlag,
							weekday: input.weekday,
						},
					},
					{ actorId },
				),
			);
		} catch (error) {
			throw new Error(
				`Schedule save failed (${error instanceof Error ? error.message : "unknown error"}); verify times and retry`,
			);
		}
	});

export const setFee = scopedAuthMiddleware
	.input(FeeSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			// Fee head (new/revisit/tele) is tracked client-side; the backend
			// stores one amount per practitioner/service effective date.
			return await pm.run(tenantId, () =>
				pm.healthcare.practitioners.setFee.run(
					{
						input: {
							amount: input.amount,
							branchId: input.branchId,
							effectiveFrom: input.effectiveFrom,
							practitionerId: input.practitionerId,
							serviceId: input.serviceId,
						},
					},
					{ actorId },
				),
			);
		} catch (error) {
			throw new Error(
				`Fee save failed (${error instanceof Error ? error.message : "unknown error"}); verify the amount and retry`,
			);
		}
	});

export const blockLeave = scopedAuthMiddleware
	.input(LeaveBlockSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.practitioners.blockLeave.run(
					{
						input: {
							branchId: input.branchId,
							from: input.from,
							practitionerId: input.practitionerId,
							reason: input.reason,
							to: input.to,
						},
					},
					{ actorId },
				),
			);
		} catch (error) {
			throw new Error(
				`Leave block failed (${error instanceof Error ? error.message : "unknown error"}); verify the dates and retry`,
			);
		}
	});

export const conflict = scopedAuthMiddleware
	.input(ConflictQuerySchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.practitioners.conflict.run(
					{
						input: {
							from: input.from,
							practitionerId: input.practitionerId,
							to: input.to,
						},
					},
					{ actorId },
				),
			);
		} catch (error) {
			throw new Error(
				`Conflict check failed (${error instanceof Error ? error.message : "unknown error"}); verify the range and retry`,
			);
		}
	});

export const nextFreeSlot = scopedAuthMiddleware
	.input(NextSlotQuerySchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.practitioners.nextFreeSlot.run(
					{
						input: {
							branchId: input.branchId,
							from: input.from,
							practitionerId: input.practitionerId,
						},
					},
					{ actorId },
				),
			);
		} catch (error) {
			throw new Error(
				`Next-slot search failed (${error instanceof Error ? error.message : "unknown error"}); check the schedule and retry`,
			);
		}
	});
