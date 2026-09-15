// NOTE: `pm` is lazily imported inside handlers (not statically) because the
// clinic track contract forbids top-level pm/router imports in procedures.
import {
	CheckInteractionSchema,
	CreateChronicLogSchema,
	CreateExamFindingSchema,
	CreateImmunizationSchema,
	CreateProblemSchema,
	CreateRegisterEntrySchema,
	CreateSoapNoteSchema,
	CreateTriageEntrySchema,
	ProblemListFiltersSchema,
	SoapNoteFiltersSchema,
	UpdateProblemSchema,
} from "@aspen-os/healthcare";
import { union } from "valibot";

import { scopedAuthMiddleware } from "../middlewares/scoped_auth";

export const saveSoap = scopedAuthMiddleware
	.input(CreateSoapNoteSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.allopathy.saveSoap.run({ input }, { actorId }),
		);
	});

export const saveExam = scopedAuthMiddleware
	.input(CreateExamFindingSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.allopathy.saveExam.run({ input }, { actorId }),
		);
	});

export const logChronic = scopedAuthMiddleware
	.input(CreateChronicLogSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.allopathy.logChronic.run({ input }, { actorId }),
		);
	});

export const recordImmunization = scopedAuthMiddleware
	.input(CreateImmunizationSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.allopathy.recordImmunization.run({ input }, { actorId }),
		);
	});

export const triageEntry = scopedAuthMiddleware
	.input(CreateTriageEntrySchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.allopathy.triageEntry.run({ input }, { actorId }),
		);
	});

export const registerEntry = scopedAuthMiddleware
	.input(CreateRegisterEntrySchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.allopathy.registerEntry.run({ input }, { actorId }),
		);
	});

export const listSoap = scopedAuthMiddleware
	.input(SoapNoteFiltersSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.allopathy.listSoap.run({ input }, { actorId }),
		);
	});

export const problemUpsert = scopedAuthMiddleware
	.input(union([CreateProblemSchema, UpdateProblemSchema]))
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.allopathy.problemUpsert.run({ input }, { actorId }),
		);
	});

export const problemList = scopedAuthMiddleware
	.input(ProblemListFiltersSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.allopathy.problemList.run({ input }, { actorId }),
		);
	});

export const checkInteraction = scopedAuthMiddleware
	.input(CheckInteractionSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.allopathy.checkInteraction.run({ input }, { actorId }),
		);
	});
