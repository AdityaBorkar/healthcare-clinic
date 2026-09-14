// NOTE: `pm` is lazily imported inside handlers (not statically) because the
// clinic track contract forbids top-level pm/router imports in procedures.
import {
	ChairSlotInputSchema,
	ConsentFormInputSchema,
	DentalChartInputSchema,
	DentalPackageInputSchema,
	ImplantMilestoneInputSchema,
	LabJobInputSchema,
	LabJobTrackInputSchema,
	PendingJobsFilterSchema,
	PlanStageCloseInputSchema,
	QuoteInputSchema,
	RescheduleStageInputSchema,
	TreatmentPlanInputSchema,
} from "#/schemas/dental";
import { authMiddleware } from "../middlewares/auth";
import { requireOrganizationSlug } from "../utils/subdomain";
import { resolveTenantDatabaseName } from "../utils/workspace-organization";

export const chart = authMiddleware
	.input(DentalChartInputSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.dental.chart.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const buildPlan = authMiddleware
	.input(TreatmentPlanInputSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.dental.buildPlan.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const quote = authMiddleware
	.input(QuoteInputSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.dental.quote.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const consent = authMiddleware
	.input(ConsentFormInputSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.dental.consent.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const bookChair = authMiddleware
	.input(ChairSlotInputSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.dental.bookChair.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const raiseLabJob = authMiddleware
	.input(LabJobInputSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.dental.raiseLabJob.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const trackLabJob = authMiddleware
	.input(LabJobTrackInputSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.dental.trackLabJob.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const closeStage = authMiddleware
	.input(PlanStageCloseInputSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.dental.closeStage.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const pendingJobs = authMiddleware
	.input(PendingJobsFilterSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.dental.pendingJobs.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const rescheduleStage = authMiddleware
	.input(RescheduleStageInputSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.dental.rescheduleStage.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const implantMilestone = authMiddleware
	.input(ImplantMilestoneInputSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.dental.implantMilestone.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const sellPackage = authMiddleware
	.input(DentalPackageInputSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.dental.sellPackage.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});
