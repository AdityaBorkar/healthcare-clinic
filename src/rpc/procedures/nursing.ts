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
import { authed } from "../middlewares/auth";
import { requireOrganizationSlug } from "../utils/subdomain";
import { resolveTenantDatabaseName } from "../utils/workspace-organization";

export const tasksFromOrders = authed
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

export const board = authed
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

export const vitalsChart = authed
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

export const ioChart = authed
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

export const painScore = authed
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

export const riskScreen = authed
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

export const drugAdminister = authed
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

export const missedEscalate = authed
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
export const sittingsSupport = authed
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

export const checklistRecord = authed
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

export const handoverCompile = authed
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

export const handoverSign = authed
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

export const triageTag = authed
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
