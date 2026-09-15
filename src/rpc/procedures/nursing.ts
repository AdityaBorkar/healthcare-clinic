import {
	AdministerDrugSchema,
	NursingBoardSchema,
	NursingRecordVitalsSchema,
	RecordChecklistSchema,
	RecordHandoverSchema,
	RecordIoSchema,
	RecordPainSchema,
	RecordRiskScreenSchema,
	RecordSittingSchema,
	RecordTriageTagSchema,
	TasksFromOrdersSchema,
} from "@aspen-os/healthcare";

import { scopedAuthMiddleware } from "../middlewares/scoped_auth";

export const tasksFromOrders = scopedAuthMiddleware
	.input(TasksFromOrdersSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.nursing.tasksFromOrders.run({ input }, { actorId }),
		);
	});

export const board = scopedAuthMiddleware
	.input(NursingBoardSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.nursing.board.run({ input }, { actorId }),
		);
	});

export const vitalsChart = scopedAuthMiddleware
	.input(NursingRecordVitalsSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.nursing.vitalsChart.run({ input }, { actorId }),
		);
	});

export const ioChart = scopedAuthMiddleware
	.input(RecordIoSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.nursing.ioChart.run({ input }, { actorId }),
		);
	});

export const painScore = scopedAuthMiddleware
	.input(RecordPainSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.nursing.painScore.run({ input }, { actorId }),
		);
	});

export const riskScreen = scopedAuthMiddleware
	.input(RecordRiskScreenSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.nursing.riskScreen.run({ input }, { actorId }),
		);
	});

export const drugAdminister = scopedAuthMiddleware
	.input(AdministerDrugSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.nursing.drugAdminister.run({ input }, { actorId }),
		);
	});

export const missedEscalate = scopedAuthMiddleware
	.input(TasksFromOrdersSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.nursing.missedEscalate.run({ input }, { actorId }),
		);
	});
export const sittingsSupport = scopedAuthMiddleware
	.input(RecordSittingSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.nursing.sittingsSupport.run({ input }, { actorId }),
		);
	});

export const checklistRecord = scopedAuthMiddleware
	.input(RecordChecklistSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.nursing.checklistRecord.run({ input }, { actorId }),
		);
	});

export const handoverCompile = scopedAuthMiddleware
	.input(RecordHandoverSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.nursing.handoverCompile.run({ input }, { actorId }),
		);
	});

export const handoverSign = scopedAuthMiddleware
	.input(RecordHandoverSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.nursing.handoverSign.run({ input }, { actorId }),
		);
	});

export const triageTag = scopedAuthMiddleware
	.input(RecordTriageTagSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.nursing.triageTag.run({ input }, { actorId }),
		);
	});
