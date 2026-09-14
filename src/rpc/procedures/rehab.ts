import {
	BranchFilterSchema,
	DischargeSummaryInputSchema,
	ExercisePrescriptionInputSchema,
	OutcomeScoreInputSchema,
	RehabAssessmentInputSchema,
	RehabEpisodeInputSchema,
	RehabGoalPlanInputSchema,
	RehabPackageInputSchema,
	RehabSittingBookInputSchema,
	RehabSittingRecordInputSchema,
} from "#/schemas/rehab";
import { authed } from "../middlewares/auth";
import { requireOrganizationSlug } from "../utils/subdomain";
import { resolveTenantDatabaseName } from "../utils/workspace-organization";

export const openEpisode = authed
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

export const assess = authed
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

export const setGoals = authed
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

export const buildPackage = authed
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

export const bookSitting = authed
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

export const recordSitting = authed
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

export const rescore = authed
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

export const exerciseSheet = authed
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

export const discharge = authed
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

export const dayBoard = authed
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
