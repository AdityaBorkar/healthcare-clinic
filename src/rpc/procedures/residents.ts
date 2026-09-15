import {
	AllocateBedSchema,
	CompileStayBillSchema,
	CreateDailyLogSchema,
	CreateFeedbackSchema,
	CreateGeriatricScoreSchema,
	CreatePolypharmacyReviewSchema,
	CreateResidentSchema,
	CreateRoundSchema,
	CreateStayChargeSchema,
	CreateVisitLogSchema,
	FamilySummarySendSchema,
	RaiseAlertSchema,
	ResidentIdSchema,
	ResidentListSchema,
} from "@aspen-os/healthcare";

import { scopedAuthMiddleware } from "../middlewares/scoped_auth";

export const admit = scopedAuthMiddleware
	.input(CreateResidentSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.residents.admit.run({ input }, { actorId }),
		);
	});

export const allocateBed = scopedAuthMiddleware
	.input(AllocateBedSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.residents.allocateBed.run({ input }, { actorId }),
		);
	});

export const scoreGeriatric = scopedAuthMiddleware
	.input(CreateGeriatricScoreSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.residents.scoreGeriatric.run({ input }, { actorId }),
		);
	});

export const polypharmacyReview = scopedAuthMiddleware
	.input(CreatePolypharmacyReviewSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.residents.polypharmacyReview.run({ input }, { actorId }),
		);
	});

export const logDaily = scopedAuthMiddleware
	.input(CreateDailyLogSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.residents.logDaily.run({ input }, { actorId }),
		);
	});

export const round = scopedAuthMiddleware
	.input(CreateRoundSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.residents.round.run({ input }, { actorId }),
		);
	});

export const visitLog = scopedAuthMiddleware
	.input(CreateVisitLogSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.residents.visitLog.run({ input }, { actorId }),
		);
	});

export const familySummary = scopedAuthMiddleware
	.input(ResidentIdSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.residents.familySummary.run({ input }, { actorId }),
		);
	});

export const compileStayBill = scopedAuthMiddleware
	.input(CompileStayBillSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.residents.compileStayBill.run({ input }, { actorId }),
		);
	});

export const getResident = scopedAuthMiddleware
	.input(ResidentIdSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.residents.getResident.run({ input }, { actorId }),
		);
	});

export const listResidents = scopedAuthMiddleware
	.input(ResidentListSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.residents.listResidents.run({ input }, { actorId }),
		);
	});

export const recordStayCharge = scopedAuthMiddleware
	.input(CreateStayChargeSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.residents.recordStayCharge.run({ input }, { actorId }),
		);
	});

export const feedback = scopedAuthMiddleware
	.input(CreateFeedbackSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.residents.feedback.run({ input }, { actorId }),
		);
	});

export const raiseAlert = scopedAuthMiddleware
	.input(RaiseAlertSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.residents.raiseAlert.run({ input }, { actorId }),
		);
	});

export const sendFamilySummary = scopedAuthMiddleware
	.input(FamilySummarySendSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.residents.sendFamilySummary.run({ input }, { actorId }),
		);
	});
