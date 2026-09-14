import {
	BranchFilterSchema,
	DischargeSummaryInputSchema,
	ExercisePrescriptionInputSchema,
	OutcomeScoreInputSchema,
	ProgressChartInputSchema,
	RehabAssessmentInputSchema,
	RehabEpisodeInputSchema,
	RehabGoalPlanInputSchema,
	RehabPackageInputSchema,
	RehabSittingBookInputSchema,
	RehabSittingRecordInputSchema,
	ShareExerciseSheetInputSchema,
} from "#/schemas/rehab";
import { scopedAuthMiddleware } from "../middlewares/scoped_auth";

export const openEpisode = scopedAuthMiddleware
	.input(RehabEpisodeInputSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.rehab.openEpisode.run({ input }, { actorId }),
		);
	});

export const assess = scopedAuthMiddleware
	.input(RehabAssessmentInputSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.rehab.assess.run({ input }, { actorId }),
		);
	});

export const setGoals = scopedAuthMiddleware
	.input(RehabGoalPlanInputSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.rehab.setGoals.run({ input }, { actorId }),
		);
	});

export const buildPackage = scopedAuthMiddleware
	.input(RehabPackageInputSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.rehab.buildPackage.run({ input }, { actorId }),
		);
	});

export const bookSitting = scopedAuthMiddleware
	.input(RehabSittingBookInputSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.rehab.bookSitting.run({ input }, { actorId }),
		);
	});

export const recordSitting = scopedAuthMiddleware
	.input(RehabSittingRecordInputSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.rehab.recordSitting.run({ input }, { actorId }),
		);
	});

export const rescore = scopedAuthMiddleware
	.input(OutcomeScoreInputSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.rehab.rescore.run({ input }, { actorId }),
		);
	});

export const exerciseSheet = scopedAuthMiddleware
	.input(ExercisePrescriptionInputSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.rehab.exerciseSheet.run({ input }, { actorId }),
		);
	});

export const discharge = scopedAuthMiddleware
	.input(DischargeSummaryInputSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.rehab.discharge.run({ input }, { actorId }),
		);
	});

export const dayBoard = scopedAuthMiddleware
	.input(BranchFilterSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.rehab.dayBoard.run({ input }, { actorId }),
		);
	});

export const progressChart = scopedAuthMiddleware
	.input(ProgressChartInputSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.rehab.progressChart.run({ input }, { actorId }),
		);
	});

export const shareExerciseSheet = scopedAuthMiddleware
	.input(ShareExerciseSheetInputSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.rehab.shareExerciseSheet.run({ input }, { actorId }),
		);
	});
