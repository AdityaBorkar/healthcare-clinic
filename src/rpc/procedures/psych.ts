// NOTE: `pm` is lazily imported inside handlers (not statically) because the
// clinic track contract forbids top-level pm/router imports in procedures.
import {
	BookCounsellingSchema,
	CloseReadinessSchema,
	CreateCaregiverConsentSchema,
	CreateControlledPrescriptionSchema,
	CreateInvoluntaryHookSchema,
	CreatePsychAssessmentSchema,
	CreateRelapsePlanSchema,
	CreateRiskScreenSchema,
	CreateSafetyPlanSchema,
	CreateScaleResultSchema,
	CreateSeniorAlertSchema,
	CreateSideEffectCheckSchema,
	CreateWithdrawalChartSchema,
	RecallListFiltersSchema,
} from "@aspen-os/healthcare";

import { scopedAuthMiddleware } from "../middlewares/scoped_auth";

export const assess = scopedAuthMiddleware
	.input(CreatePsychAssessmentSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.psych.assess.run({ input }, { actorId }),
		);
	});

export const scoreScale = scopedAuthMiddleware
	.input(CreateScaleResultSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.psych.scoreScale.run({ input }, { actorId }),
		);
	});

export const screenRisk = scopedAuthMiddleware
	.input(CreateRiskScreenSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.psych.screenRisk.run({ input }, { actorId }),
		);
	});

export const saveSafetyPlan = scopedAuthMiddleware
	.input(CreateSafetyPlanSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.psych.saveSafetyPlan.run({ input }, { actorId }),
		);
	});

export const alertSenior = scopedAuthMiddleware
	.input(CreateSeniorAlertSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.psych.alertSenior.run({ input }, { actorId }),
		);
	});

export const bookCounselling = scopedAuthMiddleware
	.input(BookCounsellingSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.psych.bookCounselling.run({ input }, { actorId }),
		);
	});

export const bookTele = scopedAuthMiddleware
	.input(BookCounsellingSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.psych.bookTele.run({ input }, { actorId }),
		);
	});

export const chartWithdrawal = scopedAuthMiddleware
	.input(CreateWithdrawalChartSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.psych.chartWithdrawal.run({ input }, { actorId }),
		);
	});

export const relapsePlan = scopedAuthMiddleware
	.input(CreateRelapsePlanSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.psych.relapsePlan.run({ input }, { actorId }),
		);
	});

export const prescribeControlled = scopedAuthMiddleware
	.input(CreateControlledPrescriptionSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.psych.prescribeControlled.run({ input }, { actorId }),
		);
	});

export const sideEffectCheck = scopedAuthMiddleware
	.input(CreateSideEffectCheckSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.psych.sideEffectCheck.run({ input }, { actorId }),
		);
	});

export const caregiverConsent = scopedAuthMiddleware
	.input(CreateCaregiverConsentSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.psych.caregiverConsent.run({ input }, { actorId }),
		);
	});

export const involuntaryHook = scopedAuthMiddleware
	.input(CreateInvoluntaryHookSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.psych.involuntaryHook.run({ input }, { actorId }),
		);
	});

export const recallList = scopedAuthMiddleware
	.input(RecallListFiltersSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.psych.recallList.run({ input }, { actorId }),
		);
	});

export const closeReadiness = scopedAuthMiddleware
	.input(CloseReadinessSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.psych.closeReadiness.run({ input }, { actorId }),
		);
	});
