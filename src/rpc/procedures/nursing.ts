import {
	ChecklistSchema,
	DrugAdminSchema,
	HandoverSchema,
	IoSchema,
	NursingBoardSchema,
	PainSchema,
	RiskScreenSchema,
	SittingSupportSchema,
	TaskFromOrdersSchema,
	TriageTagSchema,
	VitalsSchema,
} from "#/schemas/nursing";
import { scopedAuthMiddleware } from "../middlewares/scoped_auth";

export const tasksFromOrders = scopedAuthMiddleware
	.input(TaskFromOrdersSchema)
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
	.input(VitalsSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.nursing.vitalsChart.run({ input }, { actorId }),
		);
	});

export const ioChart = scopedAuthMiddleware
	.input(IoSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.nursing.ioChart.run({ input }, { actorId }),
		);
	});

export const painScore = scopedAuthMiddleware
	.input(PainSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.nursing.painScore.run({ input }, { actorId }),
		);
	});

export const riskScreen = scopedAuthMiddleware
	.input(RiskScreenSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.nursing.riskScreen.run({ input }, { actorId }),
		);
	});

export const drugAdminister = scopedAuthMiddleware
	.input(DrugAdminSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.nursing.drugAdminister.run({ input }, { actorId }),
		);
	});

export const missedEscalate = scopedAuthMiddleware
	.input(TaskFromOrdersSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.nursing.missedEscalate.run({ input }, { actorId }),
		);
	});
export const sittingsSupport = scopedAuthMiddleware
	.input(SittingSupportSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.nursing.sittingsSupport.run({ input }, { actorId }),
		);
	});

export const checklistRecord = scopedAuthMiddleware
	.input(ChecklistSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.nursing.checklistRecord.run({ input }, { actorId }),
		);
	});

export const handoverCompile = scopedAuthMiddleware
	.input(HandoverSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.nursing.handoverCompile.run({ input }, { actorId }),
		);
	});

export const handoverSign = scopedAuthMiddleware
	.input(HandoverSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.nursing.handoverSign.run({ input }, { actorId }),
		);
	});

export const triageTag = scopedAuthMiddleware
	.input(TriageTagSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.nursing.triageTag.run({ input }, { actorId }),
		);
	});
