import {
	ChecklistSchema,
	DrugAdminSchema,
	HandoverSchema,
	IoSchema,
	NursingBoardSchema,
	PainSchema,
	RiskScreenSchema,
	SittingSupportSchema,
	TaskFromOrdersSchema,
	TriageTagSchema,
	VitalsSchema,
} from "#/schemas/nursing";
import { authMiddleware } from "../middlewares/auth";
import { requireOrganizationSlug } from "../utils/subdomain";
import { resolveTenantDatabaseName } from "../utils/workspace-organization";

export const tasksFromOrders = authMiddleware
	.input(TaskFromOrdersSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.nursing.tasksFromOrders.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const board = authMiddleware
	.input(NursingBoardSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.nursing.board.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const vitalsChart = authMiddleware
	.input(VitalsSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.nursing.vitalsChart.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const ioChart = authMiddleware
	.input(IoSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.nursing.ioChart.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const painScore = authMiddleware
	.input(PainSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.nursing.painScore.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const riskScreen = authMiddleware
	.input(RiskScreenSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.nursing.riskScreen.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const drugAdminister = authMiddleware
	.input(DrugAdminSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.nursing.drugAdminister.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const missedEscalate = authMiddleware
	.input(TaskFromOrdersSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.nursing.missedEscalate.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});
export const sittingsSupport = authMiddleware
	.input(SittingSupportSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.nursing.sittingsSupport.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const checklistRecord = authMiddleware
	.input(ChecklistSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.nursing.checklistRecord.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const handoverCompile = authMiddleware
	.input(HandoverSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.nursing.handoverCompile.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const handoverSign = authMiddleware
	.input(HandoverSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.nursing.handoverSign.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const triageTag = authMiddleware
	.input(TriageTagSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.nursing.triageTag.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});
