// NOTE: `pm` is lazily imported inside handlers (not statically) because the
// clinic track contract forbids top-level pm/router imports in procedures.
import {
	CaregiverConsentInputSchema,
	CloseReadinessInputSchema,
	ControlledPrescriptionInputSchema,
	CounsellingBookInputSchema,
	InvoluntaryHookInputSchema,
	PsychAssessmentInputSchema,
	RecallListInputSchema,
	RelapsePlanInputSchema,
	RiskScreenInputSchema,
	SafetyPlanInputSchema,
	ScaleResultInputSchema,
	SeniorAlertInputSchema,
	SideEffectCheckInputSchema,
	WithdrawalChartInputSchema,
} from "#/schemas/psych";
import { scopedAuthMiddleware } from "../middlewares/scoped_auth";

export const assess = scopedAuthMiddleware
	.input(PsychAssessmentInputSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.psych.assess.run({ input }, { actorId }),
		);
	});

export const scoreScale = scopedAuthMiddleware
	.input(ScaleResultInputSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.psych.scoreScale.run({ input }, { actorId }),
		);
	});

export const screenRisk = scopedAuthMiddleware
	.input(RiskScreenInputSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.psych.screenRisk.run({ input }, { actorId }),
		);
	});

export const saveSafetyPlan = scopedAuthMiddleware
	.input(SafetyPlanInputSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.psych.saveSafetyPlan.run({ input }, { actorId }),
		);
	});

export const alertSenior = scopedAuthMiddleware
	.input(SeniorAlertInputSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.psych.alertSenior.run({ input }, { actorId }),
		);
	});

export const bookCounselling = scopedAuthMiddleware
	.input(CounsellingBookInputSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.psych.bookCounselling.run({ input }, { actorId }),
		);
	});

export const bookTele = scopedAuthMiddleware
	.input(CounsellingBookInputSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.psych.bookTele.run({ input }, { actorId }),
		);
	});

export const chartWithdrawal = scopedAuthMiddleware
	.input(WithdrawalChartInputSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.psych.chartWithdrawal.run({ input }, { actorId }),
		);
	});

export const relapsePlan = scopedAuthMiddleware
	.input(RelapsePlanInputSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.psych.relapsePlan.run({ input }, { actorId }),
		);
	});

export const prescribeControlled = scopedAuthMiddleware
	.input(ControlledPrescriptionInputSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.psych.prescribeControlled.run({ input }, { actorId }),
		);
	});

export const sideEffectCheck = scopedAuthMiddleware
	.input(SideEffectCheckInputSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.psych.sideEffectCheck.run({ input }, { actorId }),
		);
	});

export const caregiverConsent = scopedAuthMiddleware
	.input(CaregiverConsentInputSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.psych.caregiverConsent.run({ input }, { actorId }),
		);
	});

export const involuntaryHook = scopedAuthMiddleware
	.input(InvoluntaryHookInputSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.psych.involuntaryHook.run({ input }, { actorId }),
		);
	});

export const recallList = scopedAuthMiddleware
	.input(RecallListInputSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.psych.recallList.run({ input }, { actorId }),
		);
	});

export const closeReadiness = scopedAuthMiddleware
	.input(CloseReadinessInputSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.psych.closeReadiness.run({ input }, { actorId }),
		);
	});
