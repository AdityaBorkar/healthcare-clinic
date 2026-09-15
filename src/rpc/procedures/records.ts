import {
	AppendAddendumSchema,
	AppendRegisterSchema,
	AttachDocumentSchema,
	CheckRetentionSchema,
	ConsentsGetSchema,
	DischargePendingFiltersSchema,
	EncounterGetSchema,
	FamilySummaryMultiSchema,
	IssueDischargeSchema,
	MergeRecordsSchema,
	RecentRxQuerySchema,
	RecordConsentSchema,
	RecordsIdSchema,
	RegisterFiltersSchema,
	SearchRecordsSchema,
	ShareRecordSchema,
	TimelineQuerySchema,
	VoidRegisterSchema,
} from "@aspen-os/healthcare";

import { scopedAuthMiddleware } from "../middlewares/scoped_auth";

export const timeline = scopedAuthMiddleware
	.input(TimelineQuerySchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.records.timeline.run({ input }, { actorId }),
		);
	});

export const encounterGet = scopedAuthMiddleware
	.input(EncounterGetSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.records.encounterGet.run({ input }, { actorId }),
		);
	});

export const search = scopedAuthMiddleware
	.input(SearchRecordsSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.records.search.run({ input }, { actorId }),
		);
	});

export const notesMask = scopedAuthMiddleware
	.input(TimelineQuerySchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.records.notesMask.run({ input }, { actorId }),
		);
	});

export const docsAttach = scopedAuthMiddleware
	.input(AttachDocumentSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.records.docsAttach.run({ input }, { actorId }),
		);
	});

export const docsVerify = scopedAuthMiddleware
	.input(RecordsIdSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.records.docsVerify.run({ input }, { actorId }),
		);
	});

export const sharePrint = scopedAuthMiddleware
	.input(ShareRecordSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.records.sharePrint.run({ input }, { actorId }),
		);
	});

export const shareWhatsapp = scopedAuthMiddleware
	.input(ShareRecordSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.records.shareWhatsapp.run({ input }, { actorId }),
		);
	});

export const familySummary = scopedAuthMiddleware
	.input(TimelineQuerySchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.records.familySummary.run({ input }, { actorId }),
		);
	});

export const registersAppend = scopedAuthMiddleware
	.input(AppendRegisterSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.records.registersAppend.run({ input }, { actorId }),
		);
	});

export const registersVoid = scopedAuthMiddleware
	.input(VoidRegisterSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.records.registersVoid.run({ input }, { actorId }),
		);
	});

export const registersExport = scopedAuthMiddleware
	.input(RegisterFiltersSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.records.registersExport.run({ input }, { actorId }),
		);
	});

export const addendumAppend = scopedAuthMiddleware
	.input(AppendAddendumSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.records.addendumAppend.run({ input }, { actorId }),
		);
	});

export const dischargePending = scopedAuthMiddleware
	.input(DischargePendingFiltersSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.records.dischargePending.run({ input }, { actorId }),
		);
	});

export const dischargeIssue = scopedAuthMiddleware
	.input(IssueDischargeSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.records.dischargeIssue.run({ input }, { actorId }),
		);
	});

export const consentsGet = scopedAuthMiddleware
	.input(ConsentsGetSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.records.consentsGet.run({ input }, { actorId }),
		);
	});

export const merge = scopedAuthMiddleware
	.input(MergeRecordsSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.records.merge.run({ input }, { actorId }),
		);
	});

export const retentionCheck = scopedAuthMiddleware
	.input(CheckRetentionSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.records.retentionCheck.run({ input }, { actorId }),
		);
	});

export const recordConsent = scopedAuthMiddleware
	.input(RecordConsentSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.records.recordConsent.run({ input }, { actorId }),
		);
	});

export const familySummaryMulti = scopedAuthMiddleware
	.input(FamilySummaryMultiSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.records.familySummaryMulti.run({ input }, { actorId }),
		);
	});

export const recentlyUsedRx = scopedAuthMiddleware
	.input(RecentRxQuerySchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.records.recentlyUsedRx.run({ input }, { actorId }),
		);
	});
