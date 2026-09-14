// NOTE: `pm` is lazily imported inside handlers (not statically) because the
// clinic track contract forbids top-level pm/router imports in procedures.
import {
	BreakGlassInputSchema,
	CaregiverConsentInputSchema,
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
import { authed } from "../middlewares/auth";
import { requireOrganizationSlug } from "../utils/subdomain";
import { resolveTenantDatabaseName } from "../utils/workspace-organization";

export const assess = authed
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

export const scoreScale = authed
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

export const screenRisk = authed
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

export const saveSafetyPlan = authed
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

export const alertSenior = authed
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

export const bookCounselling = authed
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

export const bookTele = authed
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

export const chartWithdrawal = authed
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

export const relapsePlan = authed
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

export const prescribeControlled = authed
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

export const sideEffectCheck = authed
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

export const caregiverConsent = authed
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

export const involuntaryHook = authed
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

export const breakGlass = authed
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

export const recallList = authed
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
