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
import { authMiddleware } from "../middlewares/auth";
import { requireOrganizationSlug } from "../utils/subdomain";
import { resolveTenantDatabaseName } from "../utils/workspace-organization";

export const openEpisode = authMiddleware
	.input(RehabEpisodeInputSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.rehab.openEpisode.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const assess = authMiddleware
	.input(RehabAssessmentInputSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.rehab.assess.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const setGoals = authMiddleware
	.input(RehabGoalPlanInputSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.rehab.setGoals.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const buildPackage = authMiddleware
	.input(RehabPackageInputSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.rehab.buildPackage.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const bookSitting = authMiddleware
	.input(RehabSittingBookInputSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.rehab.bookSitting.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const recordSitting = authMiddleware
	.input(RehabSittingRecordInputSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.rehab.recordSitting.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const rescore = authMiddleware
	.input(OutcomeScoreInputSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.rehab.rescore.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const exerciseSheet = authMiddleware
	.input(ExercisePrescriptionInputSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.rehab.exerciseSheet.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const discharge = authMiddleware
	.input(DischargeSummaryInputSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.rehab.discharge.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const dayBoard = authMiddleware
	.input(BranchFilterSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.rehab.dayBoard.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const progressChart = authMiddleware
	.input(ProgressChartInputSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.rehab.progressChart.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const shareExerciseSheet = authMiddleware
	.input(ShareExerciseSheetInputSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.rehab.shareExerciseSheet.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});
