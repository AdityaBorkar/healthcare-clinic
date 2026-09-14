import {
	AttendanceMarkSchema,
	BranchCreateSchema,
	ComplianceEvidenceSchema,
	ComplianceListSchema,
	ExplorerGrantSchema,
	ExplorerQuerySchema,
	LeaveDecideSchema,
	LeaveRequestSchema,
	MasterFilterSchema,
	MasterUpsertSchema,
	MessageRetrySchema,
	MessageSendSchema,
	OperationsIdSchema,
	OptOutSchema,
	PayrollExportSchema,
	ReportDefSchema,
	ReportListSchema,
	ReportRunSchema,
	RosterPlanSchema,
	SeedPresetsSchema,
	StaffUpsertSchema,
} from "#/schemas/operations";
import { authMiddleware } from "../middlewares/auth";
import { requireOrganizationSlug } from "../utils/subdomain";
import { resolveTenantDatabaseName } from "../utils/workspace-organization";

export const hrStaffUpsert = authMiddleware
	.input(StaffUpsertSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.staff.upsertStaff.run(
				{
					input: {
						branchId: input.branchId,
						department: input.department,
						doj: input.doj,
						exitDate: input.exitDate,
						name: input.name,
						phone: input.phone,
						role: input.role,
						staffId: input.staffId,
						status: input.status,
					},
				},
				{ actorId: context.session.user.id },
			),
		);
	});

export const rosterPlan = authMiddleware
	.input(RosterPlanSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.staff.rosterPlan.run(
				{
					input: {
						branchId: input.branchId,
						entries: input.entries,
						month: input.month,
					},
				},
				{ actorId: context.session.user.id },
			),
		);
	});

export const attendanceMark = authMiddleware
	.input(AttendanceMarkSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.staff.attendanceMark.run(
				{
					input: {
						branchId: input.branchId,
						date: input.date,
						staffId: input.staffId,
						status: input.status,
					},
				},
				{ actorId: context.session.user.id },
			),
		);
	});

export const leaveRequest = authMiddleware
	.input(LeaveRequestSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.staff.leaveRequest.run(
				{
					input: {
						branchId: input.branchId,
						from: input.from,
						reason: input.reason,
						staffId: input.staffId,
						to: input.to,
					},
				},
				{ actorId: context.session.user.id },
			),
		);
	});

export const leaveDecide = authMiddleware
	.input(LeaveDecideSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.staff.leaveDecide.run(
				{
					input: {
						branchId: input.branchId,
						decidedBy: input.decidedBy,
						decision: input.decision,
						leaveId: input.leaveId,
					},
				},
				{ actorId: context.session.user.id },
			),
		);
	});

export const payrollExport = authMiddleware
	.input(PayrollExportSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.staff.payrollExport.run(
				{
					input: {
						branchId: input.branchId,
						month: input.month,
					},
				},
				{ actorId: context.session.user.id },
			),
		);
	});

export const mastersUpsert = authMiddleware
	.input(MasterUpsertSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.operations.mastersUpsert.run(
				{
					input: {
						branchId: input.branchId,
						domain: input.domain,
						key: input.key,
						value: input.value,
					},
				},
				{ actorId: context.session.user.id },
			),
		);
	});

export const branchesCreate = authMiddleware
	.input(BranchCreateSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.operations.branchesCreate.run(
				{
					input: {
						address: input.address,
						name: input.name,
						slug: input.slug,
					},
				},
				{ actorId: context.session.user.id },
			),
		);
	});

export const seedPresets = authMiddleware
	.input(SeedPresetsSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.operations.seedPresets.run(
				{
					input: {
						branchId: input.branchId,
						preset: input.preset,
					},
				},
				{ actorId: context.session.user.id },
			),
		);
	});

export const explorerQuery = authMiddleware
	.input(ExplorerQuerySchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.operations.explorerQuery.run(
				{
					input: {
						branchId: input.branchId,
						collection: input.collection,
						filters: input.filters,
						limit: input.limit,
						offset: input.offset,
						sort: input.sort,
					},
				},
				{ actorId: context.session.user.id },
			),
		);
	});

export const explorerExportCsv = authMiddleware
	.input(ExplorerQuerySchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.operations.explorerExportCsv.run(
				{
					input: {
						branchId: input.branchId,
						collection: input.collection,
						filters: input.filters,
						limit: input.limit,
						offset: input.offset,
						sort: input.sort,
					},
				},
				{ actorId: context.session.user.id },
			),
		);
	});

export const reportsDefine = authMiddleware
	.input(ReportDefSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.operations.reportsDefine.run(
				{
					input: {
						branchId: input.branchId,
						collection: input.collection,
						filters: input.filters,
						name: input.name,
					},
				},
				{ actorId: context.session.user.id },
			),
		);
	});

export const reportsRun = authMiddleware
	.input(ReportRunSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.operations.reportsRun.run(
				{
					input: {
						branchId: input.branchId,
						limit: input.limit,
						reportId: input.reportId,
					},
				},
				{ actorId: context.session.user.id },
			),
		);
	});

export const complianceEvidence = authMiddleware
	.input(ComplianceEvidenceSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.operations.complianceEvidence.run(
				{
					input: {
						attestedBy: input.attestedBy,
						branchId: input.branchId,
						control: input.control,
						evidencePath: input.evidencePath,
						framework: input.framework,
					},
				},
				{ actorId: context.session.user.id },
			),
		);
	});

export const messagingSend = authMiddleware
	.input(MessageSendSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.operations.messagingSend.run(
				{
					input: {
						branchId: input.branchId,
						channel: input.channel,
						patientId: input.patientId,
						template: input.template,
						to: input.to,
					},
				},
				{ actorId: context.session.user.id },
			),
		);
	});

export const messagingRetry = authMiddleware
	.input(MessageRetrySchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.operations.messagingRetry.run(
				{
					input: {
						branchId: input.branchId,
						messageId: input.messageId,
					},
				},
				{ actorId: context.session.user.id },
			),
		);
	});

export const messagingOptOut = authMiddleware
	.input(OptOutSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.operations.messagingOptOut.run(
				{
					input: {
						branchId: input.branchId,
						channel: input.channel,
						to: input.to,
					},
				},
				{ actorId: context.session.user.id },
			),
		);
	});

export const explorerGrant = authMiddleware
	.input(ExplorerGrantSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.operations.explorerGrant.run(
				{
					input: {
						branchId: input.branchId,
						expiresAt: input.expiresAt,
						granteeId: input.granteeId,
						scope: input.scope,
					},
				},
				{ actorId: context.session.user.id },
			),
		);
	});

export const auditQuery = authMiddleware
	.input(OperationsIdSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.operations.auditQuery.run(
				{ input: { branchId: input.branchId, limit: 200 } },
				{ actorId: context.session.user.id },
			),
		);
	});

export const mastersGet = authMiddleware
	.input(MasterFilterSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.operations.mastersGet.run(
				{ input: { branchId: input.branchId, domain: input.domain } },
				{ actorId: context.session.user.id },
			),
		);
	});

export const complianceList = authMiddleware
	.input(ComplianceListSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.operations.complianceList.run(
				{ input: { branchId: input.branchId, framework: input.framework } },
				{ actorId: context.session.user.id },
			),
		);
	});

export const reportsList = authMiddleware
	.input(ReportListSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.operations.reportsList.run(
				{ input: { branchId: input.branchId, collection: input.collection } },
				{ actorId: context.session.user.id },
			),
		);
	});
