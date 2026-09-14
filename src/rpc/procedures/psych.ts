// NOTE: `pm` is lazily imported inside handlers (not statically) because the
// clinic track contract forbids top-level pm/router imports in procedures.
import {
	BreakGlassInputSchema,
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
import { authMiddleware } from "../middlewares/auth";
import { requireOrganizationSlug } from "../utils/subdomain";
import { resolveTenantDatabaseName } from "../utils/workspace-organization";

export const assess = authMiddleware
	.input(PsychAssessmentInputSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.psych.assess.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const scoreScale = authMiddleware
	.input(ScaleResultInputSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.psych.scoreScale.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const screenRisk = authMiddleware
	.input(RiskScreenInputSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.psych.screenRisk.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const saveSafetyPlan = authMiddleware
	.input(SafetyPlanInputSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.psych.saveSafetyPlan.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const alertSenior = authMiddleware
	.input(SeniorAlertInputSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.psych.alertSenior.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const bookCounselling = authMiddleware
	.input(CounsellingBookInputSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.psych.bookCounselling.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const bookTele = authMiddleware
	.input(CounsellingBookInputSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.psych.bookTele.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const chartWithdrawal = authMiddleware
	.input(WithdrawalChartInputSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.psych.chartWithdrawal.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const relapsePlan = authMiddleware
	.input(RelapsePlanInputSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.psych.relapsePlan.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const prescribeControlled = authMiddleware
	.input(ControlledPrescriptionInputSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.psych.prescribeControlled.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const sideEffectCheck = authMiddleware
	.input(SideEffectCheckInputSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.psych.sideEffectCheck.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const caregiverConsent = authMiddleware
	.input(CaregiverConsentInputSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.psych.caregiverConsent.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const involuntaryHook = authMiddleware
	.input(InvoluntaryHookInputSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.psych.involuntaryHook.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const breakGlass = authMiddleware
	.input(BreakGlassInputSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.psych.breakGlass.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const recallList = authMiddleware
	.input(RecallListInputSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.psych.recallList.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const closeReadiness = authMiddleware
	.input(CloseReadinessInputSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.psych.closeReadiness.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});
