import {
	AddendumSchema,
	BreakGlassSchema,
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
import { authed } from "../middlewares/auth";
import { requireOrganizationSlug } from "../utils/subdomain";
import { resolveTenantDatabaseName } from "../utils/workspace-organization";

export const timeline = authed
	.input(TimelineQuerySchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.records.timeline.run(
				{
					input: {
						branchId: input.branchId,
						patientId: input.patientId,
					},
				},
				{ actorId: context.session.user.id },
			),
		);
	});

export const encounterGet = authed
	.input(EncounterGetSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.records.encounterGet.run(
				{
					input: {
						branchId: input.branchId,
						encounterId: input.encounterId,
					},
				},
				{ actorId: context.session.user.id },
			),
		);
	});

export const search = authed
	.input(RecordsSearchSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.records.search.run(
				{
					input: {
						branchId: input.branchId,
						q: input.q,
					},
				},
				{ actorId: context.session.user.id },
			),
		);
	});

export const notesMask = authed
	.input(TimelineQuerySchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.records.notesMask.run(
				{
					input: {
						branchId: input.branchId,
						patientId: input.patientId,
					},
				},
				{ actorId: context.session.user.id },
			),
		);
	});

export const breakglass = authed
	.input(BreakGlassSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.records.breakglass.run(
				{
					input: {
						accessedBy: input.accessedBy,
						branchId: input.branchId,
						patientId: input.patientId,
						reason: input.reason,
					},
				},
				{ actorId: context.session.user.id },
			),
		);
	});

export const docsAttach = authed
	.input(DocumentAttachSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
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
				{ actorId: context.session.user.id },
			),
		);
	});

export const docsVerify = authed
	.input(RecordsIdSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.records.docsVerify.run(
				{
					input: {
						branchId: input.branchId,
						id: input.id,
					},
				},
				{ actorId: context.session.user.id },
			),
		);
	});

export const sharePrint = authed
	.input(ShareSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
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
				{ actorId: context.session.user.id },
			),
		);
	});

export const shareWhatsapp = authed
	.input(ShareSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
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
				{ actorId: context.session.user.id },
			),
		);
	});

export const familySummary = authed
	.input(TimelineQuerySchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.records.familySummary.run(
				{
					input: {
						branchId: input.branchId,
						patientId: input.patientId,
					},
				},
				{ actorId: context.session.user.id },
			),
		);
	});

export const registersAppend = authed
	.input(RegisterEntrySchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
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
				{ actorId: context.session.user.id },
			),
		);
	});

export const registersVoid = authed
	.input(RegisterVoidSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.records.registersVoid.run(
				{
					input: {
						branchId: input.branchId,
						entryId: input.entryId,
						reason: input.reason,
						voidedBy: input.voidedBy,
					},
				},
				{ actorId: context.session.user.id },
			),
		);
	});

export const registersExport = authed
	.input(RegisterEntrySchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.records.registersExport.run(
				{
					input: {
						branchId: input.branchId,
						register: input.register,
					},
				},
				{ actorId: context.session.user.id },
			),
		);
	});

export const addendumAppend = authed
	.input(AddendumSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.records.addendumAppend.run(
				{
					input: {
						authorId: input.authorId,
						branchId: input.branchId,
						encounterId: input.encounterId,
						note: input.note,
					},
				},
				{ actorId: context.session.user.id },
			),
		);
	});

export const dischargePending = authed
	.input(DischargePendingSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.records.dischargePending.run(
				{
					input: {
						branchId: input.branchId,
						patientId: input.patientId,
						ward: input.ward,
					},
				},
				{ actorId: context.session.user.id },
			),
		);
	});

export const dischargeIssue = authed
	.input(DischargeIssueSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.records.dischargeIssue.run(
				{
					input: {
						branchId: input.branchId,
						encounterId: input.encounterId,
						issuedBy: input.issuedBy,
						summary: input.summary,
					},
				},
				{ actorId: context.session.user.id },
			),
		);
	});

export const consentsGet = authed
	.input(ConsentsGetSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.records.consentsGet.run(
				{
					input: {
						branchId: input.branchId,
						patientId: input.patientId,
					},
				},
				{ actorId: context.session.user.id },
			),
		);
	});

export const merge = authed
	.input(MergeSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.records.merge.run(
				{
					input: {
						branchId: input.branchId,
						duplicateId: input.duplicateId,
						mergedBy: input.mergedBy,
						primaryId: input.primaryId,
					},
				},
				{ actorId: context.session.user.id },
			),
		);
	});

export const retentionCheck = authed
	.input(RetentionCheckSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.records.retentionCheck.run(
				{
					input: {
						branchId: input.branchId,
						patientId: input.patientId,
						recordClass: input.recordClass,
					},
				},
				{ actorId: context.session.user.id },
			),
		);
	});

export const recordConsent = authed
	.input(RecordConsentSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
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
				{ actorId: context.session.user.id },
			),
		);
	});

export const familySummaryMulti = authed
	.input(FamilySummaryMultiSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.records.familySummaryMulti.run(
				{
					input: {
						branchId: input.branchId,
						patientIds: input.patientIds,
					},
				},
				{ actorId: context.session.user.id },
			),
		);
	});

export const recentlyUsedRx = authed
	.input(RecentRxQuerySchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.records.recentlyUsedRx.run(
				{
					input: {
						branchId: input.branchId,
						limit: input.limit,
						patientId: input.patientId,
					},
				},
				{ actorId: context.session.user.id },
			),
		);
	});
