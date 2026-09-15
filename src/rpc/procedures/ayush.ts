// NOTE: `pm` is lazily imported inside handlers (not statically) because the
// clinic track contract forbids top-level pm/router imports in procedures.
import {
	AyushPrescriptionSchema,
	BookNadiSchema,
	CreateAyushCaseSheetSchema,
	CreateAyushDiagnosisSchema,
	CreateDietPlanSchema,
	CreateRepertorizationSchema,
	CreateTherapyPackageSchema,
	CreateTherapySittingSchema,
	CreateYogaBatchSchema,
	CreateYogaEnrollmentSchema,
	FollowUpGridListSchema,
	FollowUpGridSaveSchema,
	PackageOutcomeSchema,
	PauseExtendPackageSchema,
	YogaAttendanceSchema,
} from "@aspen-os/healthcare";

import { scopedAuthMiddleware } from "../middlewares/scoped_auth";

export const saveCaseSheet = scopedAuthMiddleware
	.input(CreateAyushCaseSheetSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.ayush.saveCaseSheet.run({ input }, { actorId }),
		);
	});

export const repertorize = scopedAuthMiddleware
	.input(CreateRepertorizationSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.ayush.repertorize.run({ input }, { actorId }),
		);
	});

export const dualCode = scopedAuthMiddleware
	.input(CreateAyushDiagnosisSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.ayush.dualCode.run({ input }, { actorId }),
		);
	});

export const bookNadi = scopedAuthMiddleware
	.input(BookNadiSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.ayush.bookNadi.run({ input }, { actorId }),
		);
	});

export const scheduleTherapy = scopedAuthMiddleware
	.input(CreateTherapySittingSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.ayush.scheduleTherapy.run({ input }, { actorId }),
		);
	});

export const recordSitting = scopedAuthMiddleware
	.input(CreateTherapySittingSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.ayush.recordSitting.run({ input }, { actorId }),
		);
	});

export const sellPackage = scopedAuthMiddleware
	.input(CreateTherapyPackageSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.ayush.sellPackage.run({ input }, { actorId }),
		);
	});

export const pauseExtendPackage = scopedAuthMiddleware
	.input(PauseExtendPackageSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.ayush.pauseExtendPackage.run({ input }, { actorId }),
		);
	});

export const issueDiet = scopedAuthMiddleware
	.input(CreateDietPlanSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.ayush.issueDiet.run({ input }, { actorId }),
		);
	});

export const enrollYoga = scopedAuthMiddleware
	.input(CreateYogaEnrollmentSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.ayush.enrollYoga.run({ input }, { actorId }),
		);
	});

export const createYogaBatch = scopedAuthMiddleware
	.input(CreateYogaBatchSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.ayush.createYogaBatch.run({ input }, { actorId }),
		);
	});

export const saveFollowUpGrid = scopedAuthMiddleware
	.input(FollowUpGridSaveSchema)
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
	.input(YogaAttendanceSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.ayush.markYogaAttendance.run({ input }, { actorId }),
		);
	});

export const prescribeAyush = scopedAuthMiddleware
	.input(AyushPrescriptionSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.ayush.prescribe.run({ input }, { actorId }),
		);
	});

export const recordPackageOutcome = scopedAuthMiddleware
	.input(PackageOutcomeSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.ayush.recordPackageOutcome.run({ input }, { actorId }),
		);
	});
