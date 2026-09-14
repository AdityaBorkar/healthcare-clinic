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
import { authed } from "../middlewares/auth";
import { requireOrganizationSlug } from "../utils/subdomain";
import { resolveTenantDatabaseName } from "../utils/workspace-organization";

export const testMasterUpsert = authed
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

export const panelCreate = authed
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

export const orderLabs = authed
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

export const collectSample = authed
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

export const receiveSample = authed
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

export const sampleReject = authed
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

export const addonTest = authed
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

export const processingStart = authed
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

export const tatReport = authed
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

export const resultEnter = authed
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

export const criticalAck = authed
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

export const authorize = authed
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

export const deliver = authed
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

export const radioBook = authed
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

export const radioReschedule = authed
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

export const radioCheckin = authed
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

export const radioReportAttach = authed
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

export const radioAuthorize = authed
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

export const qcLog = authed
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

export const cancelOrder = authed
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

export const getOrder = authed
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

export const queue = authed
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
