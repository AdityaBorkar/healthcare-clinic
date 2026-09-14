import {
	BedAllocateSchema,
	DailyLogSchema,
	FamilySummarySendSchema,
	FeedbackSchema,
	GeriatricScoreSchema,
	PolypharmacyReviewSchema,
	RaiseAlertSchema,
	ResidentAdmitSchema,
	ResidentIdSchema,
	ResidentListSchema,
	RoundSchema,
	StayBillCompileSchema,
	StayChargeSchema,
	VisitLogSchema,
} from "#/schemas/residents";
import { authed } from "../middlewares/auth";
import { requireOrganizationSlug } from "../utils/subdomain";
import { resolveTenantDatabaseName } from "../utils/workspace-organization";

export const admit = authed
	.input(ResidentAdmitSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.residents.admit.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const allocateBed = authed
	.input(BedAllocateSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.residents.allocateBed.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const scoreGeriatric = authed
	.input(GeriatricScoreSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.residents.scoreGeriatric.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const polypharmacyReview = authed
	.input(PolypharmacyReviewSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.residents.polypharmacyReview.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const logDaily = authed
	.input(DailyLogSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.residents.logDaily.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const round = authed
	.input(RoundSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.residents.round.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const visitLog = authed
	.input(VisitLogSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.residents.visitLog.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const familySummary = authed
	.input(ResidentIdSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.residents.familySummary.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const compileStayBill = authed
	.input(StayBillCompileSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.residents.compileStayBill.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const getResident = authed
	.input(ResidentIdSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.residents.getResident.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const listResidents = authed
	.input(ResidentListSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.residents.listResidents.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const recordStayCharge = authed
	.input(StayChargeSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.residents.recordStayCharge.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const feedback = authed
	.input(FeedbackSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.residents.feedback.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const raiseAlert = authed
	.input(RaiseAlertSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.residents.raiseAlert.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const sendFamilySummary = authed
	.input(FamilySummarySendSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.residents.sendFamilySummary.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});
