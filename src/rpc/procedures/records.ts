import {
	AddendumSchema,
	ConsentsGetSchema,
	DischargeIssueSchema,
	DischargePendingSchema,
	DocumentAttachSchema,
	EncounterGetSchema,
	FamilySummaryMultiSchema,
	MergeSchema,
	RecentRxQuerySchema,
	RecordConsentSchema,
	RecordsIdSchema,
	RecordsSearchSchema,
	RegisterEntrySchema,
	RegisterVoidSchema,
	RetentionCheckSchema,
	ShareSchema,
	TimelineQuerySchema,
} from "#/schemas/records";
import { scopedAuthMiddleware } from "../middlewares/scoped_auth";

export const timeline = scopedAuthMiddleware
	.input(TimelineQuerySchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.records.timeline.run(
				{
					input: {
						branchId: input.branchId,
						patientId: input.patientId,
					},
				},
				{ actorId },
			),
		);
	});

export const encounterGet = scopedAuthMiddleware
	.input(EncounterGetSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.records.encounterGet.run(
				{
					input: {
						branchId: input.branchId,
						encounterId: input.encounterId,
					},
				},
				{ actorId },
			),
		);
	});

export const search = scopedAuthMiddleware
	.input(RecordsSearchSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.records.search.run(
				{
					input: {
						branchId: input.branchId,
						q: input.q,
					},
				},
				{ actorId },
			),
		);
	});

export const notesMask = scopedAuthMiddleware
	.input(TimelineQuerySchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.records.notesMask.run(
				{
					input: {
						branchId: input.branchId,
						patientId: input.patientId,
					},
				},
				{ actorId },
			),
		);
	});

export const docsAttach = scopedAuthMiddleware
	.input(DocumentAttachSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.records.docsAttach.run(
				{
					input: {
						branchId: input.branchId,
						encounterId: input.encounterId,
						filePath: input.filePath,
						fileType: input.fileType,
						label: input.label,
						patientId: input.patientId,
						uploadedBy: input.uploadedBy,
					},
				},
				{ actorId },
			),
		);
	});

export const docsVerify = scopedAuthMiddleware
	.input(RecordsIdSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.records.docsVerify.run(
				{
					input: {
						branchId: input.branchId,
						id: input.id,
					},
				},
				{ actorId },
			),
		);
	});

export const sharePrint = scopedAuthMiddleware
	.input(ShareSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.records.sharePrint.run(
				{
					input: {
						branchId: input.branchId,
						channel: input.channel,
						docId: input.docId,
						patientId: input.patientId,
						recipient: input.recipient,
						recipientConfirm: input.recipientConfirm,
						sharedBy: input.sharedBy,
					},
				},
				{ actorId },
			),
		);
	});

export const shareWhatsapp = scopedAuthMiddleware
	.input(ShareSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.records.shareWhatsapp.run(
				{
					input: {
						branchId: input.branchId,
						channel: input.channel,
						docId: input.docId,
						patientId: input.patientId,
						recipient: input.recipient,
						recipientConfirm: input.recipientConfirm,
						sharedBy: input.sharedBy,
					},
				},
				{ actorId },
			),
		);
	});

export const familySummary = scopedAuthMiddleware
	.input(TimelineQuerySchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.records.familySummary.run(
				{
					input: {
						branchId: input.branchId,
						patientId: input.patientId,
					},
				},
				{ actorId },
			),
		);
	});

export const registersAppend = scopedAuthMiddleware
	.input(RegisterEntrySchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.records.registersAppend.run(
				{
					input: {
						branchId: input.branchId,
						certifierId: input.certifierId,
						details: input.details,
						encounterId: input.encounterId,
						enteredBy: input.enteredBy,
						occurredAt: input.occurredAt,
						register: input.register,
					},
				},
				{ actorId },
			),
		);
	});

export const registersVoid = scopedAuthMiddleware
	.input(RegisterVoidSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.records.registersVoid.run(
				{
					input: {
						branchId: input.branchId,
						entryId: input.entryId,
						reason: input.reason,
						voidedBy: input.voidedBy,
					},
				},
				{ actorId },
			),
		);
	});

export const registersExport = scopedAuthMiddleware
	.input(RegisterEntrySchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.records.registersExport.run(
				{
					input: {
						branchId: input.branchId,
						register: input.register,
					},
				},
				{ actorId },
			),
		);
	});

export const addendumAppend = scopedAuthMiddleware
	.input(AddendumSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.records.addendumAppend.run(
				{
					input: {
						authorId: input.authorId,
						branchId: input.branchId,
						encounterId: input.encounterId,
						note: input.note,
					},
				},
				{ actorId },
			),
		);
	});

export const dischargePending = scopedAuthMiddleware
	.input(DischargePendingSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.records.dischargePending.run(
				{
					input: {
						branchId: input.branchId,
						patientId: input.patientId,
						ward: input.ward,
					},
				},
				{ actorId },
			),
		);
	});

export const dischargeIssue = scopedAuthMiddleware
	.input(DischargeIssueSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.records.dischargeIssue.run(
				{
					input: {
						branchId: input.branchId,
						encounterId: input.encounterId,
						issuedBy: input.issuedBy,
						summary: input.summary,
					},
				},
				{ actorId },
			),
		);
	});

export const consentsGet = scopedAuthMiddleware
	.input(ConsentsGetSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.records.consentsGet.run(
				{
					input: {
						branchId: input.branchId,
						patientId: input.patientId,
					},
				},
				{ actorId },
			),
		);
	});

export const merge = scopedAuthMiddleware
	.input(MergeSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.records.merge.run(
				{
					input: {
						branchId: input.branchId,
						duplicateId: input.duplicateId,
						mergedBy: input.mergedBy,
						primaryId: input.primaryId,
					},
				},
				{ actorId },
			),
		);
	});

export const retentionCheck = scopedAuthMiddleware
	.input(RetentionCheckSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.records.retentionCheck.run(
				{
					input: {
						branchId: input.branchId,
						patientId: input.patientId,
						recordClass: input.recordClass,
					},
				},
				{ actorId },
			),
		);
	});

export const recordConsent = scopedAuthMiddleware
	.input(RecordConsentSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.records.recordConsent.run(
				{
					input: {
						branchId: input.branchId,
						encounterId: input.encounterId,
						grantedBy: input.grantedBy,
						kind: input.kind,
						patientId: input.patientId,
					},
				},
				{ actorId },
			),
		);
	});

export const familySummaryMulti = scopedAuthMiddleware
	.input(FamilySummaryMultiSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.records.familySummaryMulti.run(
				{
					input: {
						branchId: input.branchId,
						patientIds: input.patientIds,
					},
				},
				{ actorId },
			),
		);
	});

export const recentlyUsedRx = scopedAuthMiddleware
	.input(RecentRxQuerySchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.records.recentlyUsedRx.run(
				{
					input: {
						branchId: input.branchId,
						limit: input.limit,
						patientId: input.patientId,
					},
				},
				{ actorId },
			),
		);
	});
