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
import { scopedAuthMiddleware } from "../middlewares/scoped_auth";

export const hrStaffUpsert = scopedAuthMiddleware
	.input(StaffUpsertSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
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
				{ actorId },
			),
		);
	});

export const rosterPlan = scopedAuthMiddleware
	.input(RosterPlanSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.staff.rosterPlan.run(
				{
					input: {
						branchId: input.branchId,
						entries: input.entries,
						month: input.month,
					},
				},
				{ actorId },
			),
		);
	});

export const attendanceMark = scopedAuthMiddleware
	.input(AttendanceMarkSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.staff.attendanceMark.run(
				{
					input: {
						branchId: input.branchId,
						date: input.date,
						staffId: input.staffId,
						status: input.status,
					},
				},
				{ actorId },
			),
		);
	});

export const leaveRequest = scopedAuthMiddleware
	.input(LeaveRequestSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
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
				{ actorId },
			),
		);
	});

export const leaveDecide = scopedAuthMiddleware
	.input(LeaveDecideSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.staff.leaveDecide.run(
				{
					input: {
						branchId: input.branchId,
						decidedBy: input.decidedBy,
						decision: input.decision,
						leaveId: input.leaveId,
					},
				},
				{ actorId },
			),
		);
	});

export const payrollExport = scopedAuthMiddleware
	.input(PayrollExportSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.staff.payrollExport.run(
				{
					input: {
						branchId: input.branchId,
						month: input.month,
					},
				},
				{ actorId },
			),
		);
	});

export const mastersUpsert = scopedAuthMiddleware
	.input(MasterUpsertSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.operations.mastersUpsert.run(
				{
					input: {
						branchId: input.branchId,
						domain: input.domain,
						key: input.key,
						value: input.value,
					},
				},
				{ actorId },
			),
		);
	});

export const branchesCreate = scopedAuthMiddleware
	.input(BranchCreateSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.operations.branchesCreate.run(
				{
					input: {
						address: input.address,
						name: input.name,
						slug: input.slug,
					},
				},
				{ actorId },
			),
		);
	});

export const seedPresets = scopedAuthMiddleware
	.input(SeedPresetsSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.operations.seedPresets.run(
				{
					input: {
						branchId: input.branchId,
						preset: input.preset,
					},
				},
				{ actorId },
			),
		);
	});

export const explorerQuery = scopedAuthMiddleware
	.input(ExplorerQuerySchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
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
				{ actorId },
			),
		);
	});

export const explorerExportCsv = scopedAuthMiddleware
	.input(ExplorerQuerySchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
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
				{ actorId },
			),
		);
	});

export const reportsDefine = scopedAuthMiddleware
	.input(ReportDefSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.operations.reportsDefine.run(
				{
					input: {
						branchId: input.branchId,
						collection: input.collection,
						filters: input.filters,
						name: input.name,
					},
				},
				{ actorId },
			),
		);
	});

export const reportsRun = scopedAuthMiddleware
	.input(ReportRunSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.operations.reportsRun.run(
				{
					input: {
						branchId: input.branchId,
						limit: input.limit,
						reportId: input.reportId,
					},
				},
				{ actorId },
			),
		);
	});

export const complianceEvidence = scopedAuthMiddleware
	.input(ComplianceEvidenceSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
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
				{ actorId },
			),
		);
	});

export const messagingSend = scopedAuthMiddleware
	.input(MessageSendSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
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
				{ actorId },
			),
		);
	});

export const messagingRetry = scopedAuthMiddleware
	.input(MessageRetrySchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.operations.messagingRetry.run(
				{
					input: {
						branchId: input.branchId,
						messageId: input.messageId,
					},
				},
				{ actorId },
			),
		);
	});

export const messagingOptOut = scopedAuthMiddleware
	.input(OptOutSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.operations.messagingOptOut.run(
				{
					input: {
						branchId: input.branchId,
						channel: input.channel,
						to: input.to,
					},
				},
				{ actorId },
			),
		);
	});

export const explorerGrant = scopedAuthMiddleware
	.input(ExplorerGrantSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.operations.explorerGrant.run(
				{
					input: {
						branchId: input.branchId,
						expiresAt: input.expiresAt,
						granteeId: input.granteeId,
						scope: input.scope,
					},
				},
				{ actorId },
			),
		);
	});

export const auditQuery = scopedAuthMiddleware
	.input(OperationsIdSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.operations.auditQuery.run(
				{ input: { branchId: input.branchId, limit: 200 } },
				{ actorId },
			),
		);
	});

export const mastersGet = scopedAuthMiddleware
	.input(MasterFilterSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.operations.mastersGet.run(
				{ input: { branchId: input.branchId, domain: input.domain } },
				{ actorId },
			),
		);
	});

export const complianceList = scopedAuthMiddleware
	.input(ComplianceListSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.operations.complianceList.run(
				{ input: { branchId: input.branchId, framework: input.framework } },
				{ actorId },
			),
		);
	});

export const reportsList = scopedAuthMiddleware
	.input(ReportListSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.operations.reportsList.run(
				{ input: { branchId: input.branchId, collection: input.collection } },
				{ actorId },
			),
		);
	});
