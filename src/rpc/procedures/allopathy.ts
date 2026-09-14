// NOTE: `pm` is lazily imported inside handlers (not statically) because the
// clinic track contract forbids top-level pm/router imports in procedures.
import {
	ChronicLogInputSchema,
	EncounterFilterSchema,
	ExamFindingInputSchema,
	ImmunizationInputSchema,
	ProblemListFilterSchema,
	ProblemUpsertSchema,
	RegisterEntryInputSchema,
	SoapNoteInputSchema,
	TriageEntryInputSchema,
} from "#/schemas/allopathy";
import { InteractionCheckSchema } from "#/schemas/encounters";
import { scopedAuthMiddleware } from "../middlewares/scoped_auth";

export const saveSoap = scopedAuthMiddleware
	.input(SoapNoteInputSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.allopathy.saveSoap.run({ input }, { actorId }),
		);
	});

export const saveExam = scopedAuthMiddleware
	.input(ExamFindingInputSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.allopathy.saveExam.run({ input }, { actorId }),
		);
	});

export const logChronic = scopedAuthMiddleware
	.input(ChronicLogInputSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.allopathy.logChronic.run({ input }, { actorId }),
		);
	});

export const recordImmunization = scopedAuthMiddleware
	.input(ImmunizationInputSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.allopathy.recordImmunization.run({ input }, { actorId }),
		);
	});

export const triageEntry = scopedAuthMiddleware
	.input(TriageEntryInputSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.allopathy.triageEntry.run({ input }, { actorId }),
		);
	});

export const registerEntry = scopedAuthMiddleware
	.input(RegisterEntryInputSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.allopathy.registerEntry.run({ input }, { actorId }),
		);
	});

export const listSoap = scopedAuthMiddleware
	.input(EncounterFilterSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.allopathy.listSoap.run({ input }, { actorId }),
		);
	});

export const problemUpsert = scopedAuthMiddleware
	.input(ProblemUpsertSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.allopathy.problemUpsert.run({ input }, { actorId }),
		);
	});

export const problemList = scopedAuthMiddleware
	.input(ProblemListFilterSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.allopathy.problemList.run({ input }, { actorId }),
		);
	});

export const checkInteraction = scopedAuthMiddleware
	.input(InteractionCheckSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.allopathy.checkInteraction.run({ input }, { actorId }),
		);
	});
