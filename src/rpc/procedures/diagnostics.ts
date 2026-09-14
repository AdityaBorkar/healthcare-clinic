import {
	AddOnTestSchema,
	AuthorizeSchema,
	CancelOrderSchema,
	CriticalAckSchema,
	DeliverSchema,
	DiagnosticsIdSchema,
	OrderLabsSchema,
	PanelSchema,
	ProcessingStartSchema,
	QcLogSchema,
	RadioAuthorizeSchema,
	RadioBookSchema,
	RadioCheckinSchema,
	RadioReportAttachSchema,
	RadioRescheduleSchema,
	ResultEntrySchema,
	SampleCollectSchema,
	SampleReceiveSchema,
	SampleRejectSchema,
	TatReportSchema,
	TestMasterSchema,
} from "#/schemas/diagnostics";
import { authMiddleware } from "../middlewares/auth";
import { requireOrganizationSlug } from "../utils/subdomain";
import { resolveTenantDatabaseName } from "../utils/workspace-organization";

export const testMasterUpsert = authMiddleware
	.input(TestMasterSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.diagnostics.testMasterUpsert.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const panelCreate = authMiddleware
	.input(PanelSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.diagnostics.panelCreate.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const orderLabs = authMiddleware
	.input(OrderLabsSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.diagnostics.orderLabs.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const collectSample = authMiddleware
	.input(SampleCollectSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.diagnostics.collectSample.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const receiveSample = authMiddleware
	.input(SampleReceiveSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.diagnostics.receiveSample.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const sampleReject = authMiddleware
	.input(SampleRejectSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.diagnostics.sampleReject.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const addonTest = authMiddleware
	.input(AddOnTestSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.diagnostics.addonTest.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const processingStart = authMiddleware
	.input(ProcessingStartSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.diagnostics.processingStart.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const tatReport = authMiddleware
	.input(TatReportSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.diagnostics.tatReport.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const resultEnter = authMiddleware
	.input(ResultEntrySchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.diagnostics.resultEnter.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const criticalAck = authMiddleware
	.input(CriticalAckSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.diagnostics.criticalAck.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const authorize = authMiddleware
	.input(AuthorizeSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.diagnostics.authorize.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const deliver = authMiddleware
	.input(DeliverSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.diagnostics.deliver.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const radioBook = authMiddleware
	.input(RadioBookSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.diagnostics.radioBook.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const radioReschedule = authMiddleware
	.input(RadioRescheduleSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.diagnostics.radioReschedule.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const radioCheckin = authMiddleware
	.input(RadioCheckinSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.diagnostics.radioCheckin.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const radioReportAttach = authMiddleware
	.input(RadioReportAttachSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.diagnostics.radioReportAttach.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const radioAuthorize = authMiddleware
	.input(RadioAuthorizeSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.diagnostics.radioAuthorize.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const qcLog = authMiddleware
	.input(QcLogSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.diagnostics.qcLog.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const cancelOrder = authMiddleware
	.input(CancelOrderSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.diagnostics.cancelOrder.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const getOrder = authMiddleware
	.input(DiagnosticsIdSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.diagnostics.getOrder.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const queue = authMiddleware
	.input(DiagnosticsIdSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.diagnostics.queue.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});
