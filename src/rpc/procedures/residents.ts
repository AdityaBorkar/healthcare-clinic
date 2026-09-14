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
import { authMiddleware } from "../middlewares/auth";
import { requireOrganizationSlug } from "../utils/subdomain";
import { resolveTenantDatabaseName } from "../utils/workspace-organization";

export const admit = authMiddleware
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

export const allocateBed = authMiddleware
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

export const scoreGeriatric = authMiddleware
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

export const polypharmacyReview = authMiddleware
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

export const logDaily = authMiddleware
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

export const round = authMiddleware
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

export const visitLog = authMiddleware
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

export const familySummary = authMiddleware
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

export const compileStayBill = authMiddleware
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

export const getResident = authMiddleware
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

export const listResidents = authMiddleware
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

export const recordStayCharge = authMiddleware
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

export const feedback = authMiddleware
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

export const raiseAlert = authMiddleware
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

export const sendFamilySummary = authMiddleware
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
