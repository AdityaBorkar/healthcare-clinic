// NOTE: `pm` is lazily imported inside handlers (not statically) because the
// clinic track contract forbids top-level pm/router imports in procedures.
import {
	ClosePlanStageSchema,
	CreateChairSlotSchema,
	CreateDentalChartSchema,
	CreateDentalConsentSchema,
	CreateLabJobSchema,
	CreateQuoteSchema,
	CreateTreatmentPlanSchema,
	DentalPackageSchema,
	ImplantMilestoneSchema,
	PendingJobsFiltersSchema,
	RescheduleStageSchema,
	TrackLabJobSchema,
} from "@aspen-os/healthcare";

import { scopedAuthMiddleware } from "../middlewares/scoped_auth";

export const chart = scopedAuthMiddleware
	.input(CreateDentalChartSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.dental.chart.run({ input }, { actorId }),
		);
	});

export const buildPlan = scopedAuthMiddleware
	.input(CreateTreatmentPlanSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.dental.buildPlan.run({ input }, { actorId }),
		);
	});

export const quote = scopedAuthMiddleware
	.input(CreateQuoteSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.dental.quote.run({ input }, { actorId }),
		);
	});

export const consent = scopedAuthMiddleware
	.input(CreateDentalConsentSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.dental.consent.run({ input }, { actorId }),
		);
	});

export const bookChair = scopedAuthMiddleware
	.input(CreateChairSlotSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.dental.bookChair.run({ input }, { actorId }),
		);
	});

export const raiseLabJob = scopedAuthMiddleware
	.input(CreateLabJobSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.dental.raiseLabJob.run({ input }, { actorId }),
		);
	});

export const trackLabJob = scopedAuthMiddleware
	.input(TrackLabJobSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.dental.trackLabJob.run({ input }, { actorId }),
		);
	});

export const closeStage = scopedAuthMiddleware
	.input(ClosePlanStageSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.dental.closeStage.run({ input }, { actorId }),
		);
	});

export const pendingJobs = scopedAuthMiddleware
	.input(PendingJobsFiltersSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.dental.pendingJobs.run({ input }, { actorId }),
		);
	});

export const rescheduleStage = scopedAuthMiddleware
	.input(RescheduleStageSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.dental.rescheduleStage.run({ input }, { actorId }),
		);
	});

export const implantMilestone = scopedAuthMiddleware
	.input(ImplantMilestoneSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.dental.implantMilestone.run({ input }, { actorId }),
		);
	});

export const sellPackage = scopedAuthMiddleware
	.input(DentalPackageSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.dental.sellPackage.run({ input }, { actorId }),
		);
	});
