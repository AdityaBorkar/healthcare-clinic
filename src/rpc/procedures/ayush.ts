// NOTE: `pm` is lazily imported inside handlers (not statically) because the
// clinic track contract forbids top-level pm/router imports in procedures.
import {
	AyushCaseSheetInputSchema,
	AyushDiagnosisInputSchema,
	AyushPrescriptionInputSchema,
	DietPlanInputSchema,
	FollowUpGridInputSchema,
	FollowUpGridListSchema,
	NadiBookingInputSchema,
	PackageOutcomeInputSchema,
	PackagePauseExtendInputSchema,
	RepertorizationInputSchema,
	TherapyPackageInputSchema,
	TherapySittingInputSchema,
	YogaAttendanceInputSchema,
	YogaBatchInputSchema,
	YogaEnrollmentInputSchema,
} from "#/schemas/ayush";
import { scopedAuthMiddleware } from "../middlewares/scoped_auth";

export const saveCaseSheet = scopedAuthMiddleware
	.input(AyushCaseSheetInputSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.ayush.saveCaseSheet.run({ input }, { actorId }),
		);
	});

export const repertorize = scopedAuthMiddleware
	.input(RepertorizationInputSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.ayush.repertorize.run({ input }, { actorId }),
		);
	});

export const dualCode = scopedAuthMiddleware
	.input(AyushDiagnosisInputSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.ayush.dualCode.run({ input }, { actorId }),
		);
	});

export const bookNadi = scopedAuthMiddleware
	.input(NadiBookingInputSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.ayush.bookNadi.run({ input }, { actorId }),
		);
	});

export const scheduleTherapy = scopedAuthMiddleware
	.input(TherapySittingInputSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.ayush.scheduleTherapy.run({ input }, { actorId }),
		);
	});

export const recordSitting = scopedAuthMiddleware
	.input(TherapySittingInputSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.ayush.recordSitting.run({ input }, { actorId }),
		);
	});

export const sellPackage = scopedAuthMiddleware
	.input(TherapyPackageInputSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.ayush.sellPackage.run({ input }, { actorId }),
		);
	});

export const pauseExtendPackage = scopedAuthMiddleware
	.input(PackagePauseExtendInputSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.ayush.pauseExtendPackage.run({ input }, { actorId }),
		);
	});

export const issueDiet = scopedAuthMiddleware
	.input(DietPlanInputSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.ayush.issueDiet.run({ input }, { actorId }),
		);
	});

export const enrollYoga = scopedAuthMiddleware
	.input(YogaEnrollmentInputSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.ayush.enrollYoga.run({ input }, { actorId }),
		);
	});

export const createYogaBatch = scopedAuthMiddleware
	.input(YogaBatchInputSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.ayush.createYogaBatch.run({ input }, { actorId }),
		);
	});

export const saveFollowUpGrid = scopedAuthMiddleware
	.input(FollowUpGridInputSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.ayush.saveFollowUpGrid.run({ input }, { actorId }),
		);
	});

export const listFollowUpGrid = scopedAuthMiddleware
	.input(FollowUpGridListSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.ayush.listFollowUpGrid.run({ input }, { actorId }),
		);
	});

export const markYogaAttendance = scopedAuthMiddleware
	.input(YogaAttendanceInputSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.ayush.markYogaAttendance.run({ input }, { actorId }),
		);
	});

export const prescribeAyush = scopedAuthMiddleware
	.input(AyushPrescriptionInputSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.ayush.prescribe.run({ input }, { actorId }),
		);
	});

export const recordPackageOutcome = scopedAuthMiddleware
	.input(PackageOutcomeInputSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.ayush.recordPackageOutcome.run({ input }, { actorId }),
		);
	});
