import {
	CreateEducationSchema,
	CreateLeaveBlockSchema,
	CreatePostingSchema,
	CreatePractitionerSchema,
	CreateRegistrationSchema,
	NextFreeSlotQuerySchema,
	PractitionerConflictQuerySchema,
	PractitionerFiltersSchema,
	PractitionerIdSchema,
	SetPractitionerFeeSchema,
	SetPractitionerScheduleSchema,
	UpdatePractitionerSchema,
} from "@aspen-os/healthcare";

import { scopedAuthMiddleware } from "../middlewares/scoped_auth";

export const create = scopedAuthMiddleware
	.input(CreatePractitionerSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			// Backend create accepts branchId/email/languages/name/overallYrs/
			// phone/specialistYrs/specialty only; photo/bio/signature/board/
			// fees/presence stay client-side until the backend grows them.
			// Multi-specialization: the UI sends the first entry as specialty.
			return await pm.run(tenantId, () =>
				pm.healthcare.practitioners.create.run({ input }, { actorId }),
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
				pm.healthcare.practitioners.get.run({ input }, { actorId }),
			);
		} catch (error) {
			throw new Error(
				`Practitioner lookup failed (${error instanceof Error ? error.message : "unknown error"}); check the ID and retry`,
			);
		}
	});

export const list = scopedAuthMiddleware
	.input(PractitionerFiltersSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			// Multi-specialization search stays client-side in the admin UI
			// until backend filters land.
			return await pm.run(tenantId, () =>
				pm.healthcare.practitioners.list.run({ input }, { actorId }),
			);
		} catch (error) {
			throw new Error(
				`Practitioner list failed (${error instanceof Error ? error.message : "unknown error"}); retry`,
			);
		}
	});

export const update = scopedAuthMiddleware
	.input(UpdatePractitionerSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			// Client-only patch keys (photo/bio/signature/board/fees/
			// presence/specializations) are stripped by input validation
			// before the backend update call.
			return await pm.run(tenantId, () =>
				pm.healthcare.practitioners.update.run({ input }, { actorId }),
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
				pm.healthcare.practitioners.deactivate.run({ input }, { actorId }),
			);
		} catch (error) {
			throw new Error(
				`Practitioner deactivation failed (${error instanceof Error ? error.message : "unknown error"}); check the ID and retry`,
			);
		}
	});

export const addRegistration = scopedAuthMiddleware
	.input(CreateRegistrationSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			// renewalDate is tracked client-side until the backend schema grows it.
			return await pm.run(tenantId, () =>
				pm.healthcare.practitioners.addRegistration.run({ input }, { actorId }),
			);
		} catch (error) {
			throw new Error(
				`Registration save failed (${error instanceof Error ? error.message : "unknown error"}); verify the practitioner and retry`,
			);
		}
	});

export const addEducation = scopedAuthMiddleware
	.input(CreateEducationSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.practitioners.addEducation.run({ input }, { actorId }),
			);
		} catch (error) {
			throw new Error(
				`Education save failed (${error instanceof Error ? error.message : "unknown error"}); verify the practitioner and retry`,
			);
		}
	});

export const addPosting = scopedAuthMiddleware
	.input(CreatePostingSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.practitioners.addPosting.run({ input }, { actorId }),
			);
		} catch (error) {
			throw new Error(
				`Posting save failed (${error instanceof Error ? error.message : "unknown error"}); verify the practitioner and retry`,
			);
		}
	});

export const setSchedule = scopedAuthMiddleware
	.input(SetPractitionerScheduleSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.practitioners.setSchedule.run({ input }, { actorId }),
			);
		} catch (error) {
			throw new Error(
				`Schedule save failed (${error instanceof Error ? error.message : "unknown error"}); verify times and retry`,
			);
		}
	});

export const setFee = scopedAuthMiddleware
	.input(SetPractitionerFeeSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			// Fee head (new/revisit/tele) is tracked client-side; the backend
			// stores one amount per practitioner/service effective date.
			return await pm.run(tenantId, () =>
				pm.healthcare.practitioners.setFee.run({ input }, { actorId }),
			);
		} catch (error) {
			throw new Error(
				`Fee save failed (${error instanceof Error ? error.message : "unknown error"}); verify the amount and retry`,
			);
		}
	});

export const blockLeave = scopedAuthMiddleware
	.input(CreateLeaveBlockSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.practitioners.blockLeave.run({ input }, { actorId }),
			);
		} catch (error) {
			throw new Error(
				`Leave block failed (${error instanceof Error ? error.message : "unknown error"}); verify the dates and retry`,
			);
		}
	});

export const conflict = scopedAuthMiddleware
	.input(PractitionerConflictQuerySchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.practitioners.conflict.run({ input }, { actorId }),
			);
		} catch (error) {
			throw new Error(
				`Conflict check failed (${error instanceof Error ? error.message : "unknown error"}); verify the range and retry`,
			);
		}
	});

export const nextFreeSlot = scopedAuthMiddleware
	.input(NextFreeSlotQuerySchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.practitioners.nextFreeSlot.run({ input }, { actorId }),
			);
		} catch (error) {
			throw new Error(
				`Next-slot search failed (${error instanceof Error ? error.message : "unknown error"}); check the schedule and retry`,
			);
		}
	});
