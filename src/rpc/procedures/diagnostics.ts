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
import { scopedAuthMiddleware } from "../middlewares/scoped_auth";

export const testMasterUpsert = scopedAuthMiddleware
	.input(TestMasterSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.diagnostics.testMasterUpsert.run({ input }, { actorId }),
		);
	});

export const panelCreate = scopedAuthMiddleware
	.input(PanelSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.diagnostics.panelCreate.run({ input }, { actorId }),
		);
	});

export const orderLabs = scopedAuthMiddleware
	.input(OrderLabsSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.diagnostics.orderLabs.run({ input }, { actorId }),
		);
	});

export const collectSample = scopedAuthMiddleware
	.input(SampleCollectSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.diagnostics.collectSample.run({ input }, { actorId }),
		);
	});

export const receiveSample = scopedAuthMiddleware
	.input(SampleReceiveSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.diagnostics.receiveSample.run({ input }, { actorId }),
		);
	});

export const sampleReject = scopedAuthMiddleware
	.input(SampleRejectSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.diagnostics.sampleReject.run({ input }, { actorId }),
		);
	});

export const addonTest = scopedAuthMiddleware
	.input(AddOnTestSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.diagnostics.addonTest.run({ input }, { actorId }),
		);
	});

export const processingStart = scopedAuthMiddleware
	.input(ProcessingStartSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.diagnostics.processingStart.run({ input }, { actorId }),
		);
	});

export const tatReport = scopedAuthMiddleware
	.input(TatReportSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.diagnostics.tatReport.run({ input }, { actorId }),
		);
	});

export const resultEnter = scopedAuthMiddleware
	.input(ResultEntrySchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.diagnostics.resultEnter.run({ input }, { actorId }),
		);
	});

export const criticalAck = scopedAuthMiddleware
	.input(CriticalAckSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.diagnostics.criticalAck.run({ input }, { actorId }),
		);
	});

export const authorize = scopedAuthMiddleware
	.input(AuthorizeSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.diagnostics.authorize.run({ input }, { actorId }),
		);
	});

export const deliver = scopedAuthMiddleware
	.input(DeliverSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.diagnostics.deliver.run({ input }, { actorId }),
		);
	});

export const radioBook = scopedAuthMiddleware
	.input(RadioBookSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.diagnostics.radioBook.run({ input }, { actorId }),
		);
	});

export const radioReschedule = scopedAuthMiddleware
	.input(RadioRescheduleSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.diagnostics.radioReschedule.run({ input }, { actorId }),
		);
	});

export const radioCheckin = scopedAuthMiddleware
	.input(RadioCheckinSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.diagnostics.radioCheckin.run({ input }, { actorId }),
		);
	});

export const radioReportAttach = scopedAuthMiddleware
	.input(RadioReportAttachSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.diagnostics.radioReportAttach.run({ input }, { actorId }),
		);
	});

export const radioAuthorize = scopedAuthMiddleware
	.input(RadioAuthorizeSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.diagnostics.radioAuthorize.run({ input }, { actorId }),
		);
	});

export const qcLog = scopedAuthMiddleware
	.input(QcLogSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.diagnostics.qcLog.run({ input }, { actorId }),
		);
	});

export const cancelOrder = scopedAuthMiddleware
	.input(CancelOrderSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.diagnostics.cancelOrder.run({ input }, { actorId }),
		);
	});

export const getOrder = scopedAuthMiddleware
	.input(DiagnosticsIdSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.diagnostics.getOrder.run({ input }, { actorId }),
		);
	});

export const queue = scopedAuthMiddleware
	.input(DiagnosticsIdSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.diagnostics.queue.run({ input }, { actorId }),
		);
	});
