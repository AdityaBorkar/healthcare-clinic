import {
	ComplianceFiltersSchema,
	CreateBranchSchema,
	DecideLeaveSchema,
	DefineReportSchema,
	ExportPayrollSchema,
	GrantExplorerSchema,
	MarkAttendanceSchema,
	MasterFiltersSchema,
	OptOutMessageSchema,
	PlanRosterSchema,
	QueryAuditSchema,
	QueryExplorerSchema,
	RecordComplianceEvidenceSchema,
	ReportFiltersSchema,
	RequestLeaveSchema,
	RetryMessageSchema,
	RunReportSchema,
	SeedPresetsSchema,
	SendMessageSchema,
	UpsertMasterSchema,
	UpsertStaffSchema,
} from "@aspen-os/healthcare";

import { scopedAuthMiddleware } from "../middlewares/scoped_auth";

export const hrStaffUpsert = scopedAuthMiddleware
	.input(UpsertStaffSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.staff.upsertStaff.run({ input }, { actorId }),
		);
	});

export const rosterPlan = scopedAuthMiddleware
	.input(PlanRosterSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.staff.rosterPlan.run({ input }, { actorId }),
		);
	});

export const attendanceMark = scopedAuthMiddleware
	.input(MarkAttendanceSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.staff.attendanceMark.run({ input }, { actorId }),
		);
	});

export const leaveRequest = scopedAuthMiddleware
	.input(RequestLeaveSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.staff.leaveRequest.run({ input }, { actorId }),
		);
	});

export const leaveDecide = scopedAuthMiddleware
	.input(DecideLeaveSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.staff.leaveDecide.run({ input }, { actorId }),
		);
	});

export const payrollExport = scopedAuthMiddleware
	.input(ExportPayrollSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.staff.payrollExport.run({ input }, { actorId }),
		);
	});

export const mastersUpsert = scopedAuthMiddleware
	.input(UpsertMasterSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.operations.mastersUpsert.run({ input }, { actorId }),
		);
	});

export const branchesCreate = scopedAuthMiddleware
	.input(CreateBranchSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.operations.branchesCreate.run({ input }, { actorId }),
		);
	});

export const seedPresets = scopedAuthMiddleware
	.input(SeedPresetsSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.operations.seedPresets.run({ input }, { actorId }),
		);
	});

export const explorerQuery = scopedAuthMiddleware
	.input(QueryExplorerSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.operations.explorerQuery.run({ input }, { actorId }),
		);
	});

export const explorerExportCsv = scopedAuthMiddleware
	.input(QueryExplorerSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.operations.explorerExportCsv.run({ input }, { actorId }),
		);
	});

export const reportsDefine = scopedAuthMiddleware
	.input(DefineReportSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.operations.reportsDefine.run({ input }, { actorId }),
		);
	});

export const reportsRun = scopedAuthMiddleware
	.input(RunReportSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.operations.reportsRun.run({ input }, { actorId }),
		);
	});

export const complianceEvidence = scopedAuthMiddleware
	.input(RecordComplianceEvidenceSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.operations.complianceEvidence.run({ input }, { actorId }),
		);
	});

export const messagingSend = scopedAuthMiddleware
	.input(SendMessageSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.operations.messagingSend.run({ input }, { actorId }),
		);
	});

export const messagingRetry = scopedAuthMiddleware
	.input(RetryMessageSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.operations.messagingRetry.run({ input }, { actorId }),
		);
	});

export const messagingOptOut = scopedAuthMiddleware
	.input(OptOutMessageSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.operations.messagingOptOut.run({ input }, { actorId }),
		);
	});

export const explorerGrant = scopedAuthMiddleware
	.input(GrantExplorerSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.operations.explorerGrant.run({ input }, { actorId }),
		);
	});

export const auditQuery = scopedAuthMiddleware
	.input(QueryAuditSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.operations.auditQuery.run({ input }, { actorId }),
		);
	});

export const mastersGet = scopedAuthMiddleware
	.input(MasterFiltersSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.operations.mastersGet.run({ input }, { actorId }),
		);
	});

export const complianceList = scopedAuthMiddleware
	.input(ComplianceFiltersSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.operations.complianceList.run({ input }, { actorId }),
		);
	});

export const reportsList = scopedAuthMiddleware
	.input(ReportFiltersSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.operations.reportsList.run({ input }, { actorId }),
		);
	});
