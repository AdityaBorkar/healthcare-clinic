import {
	BookRehabSittingSchema,
	CreateDischargeSummarySchema,
	CreateExercisePrescriptionSchema,
	CreateOutcomeScoreSchema,
	CreateRehabAssessmentSchema,
	CreateRehabEpisodeSchema,
	CreateRehabGoalPlanSchema,
	CreateRehabPackageSchema,
	ProgressChartSchema,
	RecordRehabSittingSchema,
	RehabFiltersSchema,
	ShareExerciseSheetSchema,
} from "@aspen-os/healthcare";

import { scopedAuthMiddleware } from "../middlewares/scoped_auth";

export const openEpisode = scopedAuthMiddleware
	.input(CreateRehabEpisodeSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.rehab.openEpisode.run({ input }, { actorId }),
		);
	});

export const assess = scopedAuthMiddleware
	.input(CreateRehabAssessmentSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.rehab.assess.run({ input }, { actorId }),
		);
	});

export const setGoals = scopedAuthMiddleware
	.input(CreateRehabGoalPlanSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.rehab.setGoals.run({ input }, { actorId }),
		);
	});

export const buildPackage = scopedAuthMiddleware
	.input(CreateRehabPackageSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.rehab.buildPackage.run({ input }, { actorId }),
		);
	});

export const bookSitting = scopedAuthMiddleware
	.input(BookRehabSittingSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.rehab.bookSitting.run({ input }, { actorId }),
		);
	});

export const recordSitting = scopedAuthMiddleware
	.input(RecordRehabSittingSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.rehab.recordSitting.run({ input }, { actorId }),
		);
	});

export const rescore = scopedAuthMiddleware
	.input(CreateOutcomeScoreSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.rehab.rescore.run({ input }, { actorId }),
		);
	});

export const exerciseSheet = scopedAuthMiddleware
	.input(CreateExercisePrescriptionSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.rehab.exerciseSheet.run({ input }, { actorId }),
		);
	});

export const discharge = scopedAuthMiddleware
	.input(CreateDischargeSummarySchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.rehab.discharge.run({ input }, { actorId }),
		);
	});

export const dayBoard = scopedAuthMiddleware
	.input(RehabFiltersSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.rehab.dayBoard.run({ input }, { actorId }),
		);
	});

export const progressChart = scopedAuthMiddleware
	.input(ProgressChartSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.rehab.progressChart.run({ input }, { actorId }),
		);
	});

export const shareExerciseSheet = scopedAuthMiddleware
	.input(ShareExerciseSheetSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.rehab.shareExerciseSheet.run({ input }, { actorId }),
		);
	});
