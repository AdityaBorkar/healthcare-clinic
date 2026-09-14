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
import { scopedAuthMiddleware } from "../middlewares/scoped_auth";

export const chart = scopedAuthMiddleware
	.input(DentalChartInputSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.dental.chart.run({ input }, { actorId }),
		);
	});

export const buildPlan = scopedAuthMiddleware
	.input(TreatmentPlanInputSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.dental.buildPlan.run({ input }, { actorId }),
		);
	});

export const quote = scopedAuthMiddleware
	.input(QuoteInputSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.dental.quote.run({ input }, { actorId }),
		);
	});

export const consent = scopedAuthMiddleware
	.input(ConsentFormInputSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.dental.consent.run({ input }, { actorId }),
		);
	});

export const bookChair = scopedAuthMiddleware
	.input(ChairSlotInputSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.dental.bookChair.run({ input }, { actorId }),
		);
	});

export const raiseLabJob = scopedAuthMiddleware
	.input(LabJobInputSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.dental.raiseLabJob.run({ input }, { actorId }),
		);
	});

export const trackLabJob = scopedAuthMiddleware
	.input(LabJobTrackInputSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.dental.trackLabJob.run({ input }, { actorId }),
		);
	});

export const closeStage = scopedAuthMiddleware
	.input(PlanStageCloseInputSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.dental.closeStage.run({ input }, { actorId }),
		);
	});

export const pendingJobs = scopedAuthMiddleware
	.input(PendingJobsFilterSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.dental.pendingJobs.run({ input }, { actorId }),
		);
	});

export const rescheduleStage = scopedAuthMiddleware
	.input(RescheduleStageInputSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.dental.rescheduleStage.run({ input }, { actorId }),
		);
	});

export const implantMilestone = scopedAuthMiddleware
	.input(ImplantMilestoneInputSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.dental.implantMilestone.run({ input }, { actorId }),
		);
	});

export const sellPackage = scopedAuthMiddleware
	.input(DentalPackageInputSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.dental.sellPackage.run({ input }, { actorId }),
		);
	});
