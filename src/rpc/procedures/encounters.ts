import {
	AddDiagnosisSchema,
	AddEncounterAddendumSchema,
	CreateEncounterSchema,
	EncounterIdSchema,
	PlaceOrderSchema,
	PrescribeSchema,
	RecordVitalsSchema,
	RefillSchema,
	SetFollowUpSchema,
} from "@aspen-os/healthcare";

import { scopedAuthMiddleware } from "../middlewares/scoped_auth";

export const create = scopedAuthMiddleware
	.input(CreateEncounterSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.encounters.create.run({ input }, { actorId }),
			);
		} catch (error) {
			throw new Error(
				`Encounter creation failed (${error instanceof Error ? error.message : "unknown error"}); verify the patient and retry`,
			);
		}
	});

export const get = scopedAuthMiddleware
	.input(EncounterIdSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.encounters.get.run({ input }, { actorId }),
			);
		} catch (error) {
			throw new Error(
				`Encounter lookup failed (${error instanceof Error ? error.message : "unknown error"}); check the ID and retry`,
			);
		}
	});

export const sign = scopedAuthMiddleware
	.input(EncounterIdSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.encounters.sign.run({ input }, { actorId }),
			);
		} catch (error) {
			throw new Error(
				`Encounter sign failed (${error instanceof Error ? error.message : "unknown error"}); check the ID and retry`,
			);
		}
	});

export const addDiagnosis = scopedAuthMiddleware
	.input(AddDiagnosisSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.encounters.addDiagnosis.run({ input }, { actorId }),
			);
		} catch (error) {
			throw new Error(
				`Diagnosis save failed (${error instanceof Error ? error.message : "unknown error"}); verify the encounter is Open and retry`,
			);
		}
	});

export const prescribe = scopedAuthMiddleware
	.input(PrescribeSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.encounters.prescribe.run({ input }, { actorId }),
			);
		} catch (error) {
			throw new Error(
				`Prescription save failed (${error instanceof Error ? error.message : "unknown error"}); verify the encounter is Open and retry`,
			);
		}
	});

export const refill = scopedAuthMiddleware
	.input(RefillSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.encounters.refill.run({ input }, { actorId }),
			);
		} catch (error) {
			throw new Error(
				`Refill failed (${error instanceof Error ? error.message : "unknown error"}); verify the encounter is Open and retry`,
			);
		}
	});

export const placeOrder = scopedAuthMiddleware
	.input(PlaceOrderSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.encounters.placeOrder.run({ input }, { actorId }),
			);
		} catch (error) {
			throw new Error(
				`Order placement failed (${error instanceof Error ? error.message : "unknown error"}); verify the encounter is Open and retry`,
			);
		}
	});

export const recordVitals = scopedAuthMiddleware
	.input(RecordVitalsSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.encounters.recordVitals.run({ input }, { actorId }),
			);
		} catch (error) {
			throw new Error(
				`Vitals save failed (${error instanceof Error ? error.message : "unknown error"}); verify the encounter is Open and retry`,
			);
		}
	});

export const setFollowUp = scopedAuthMiddleware
	.input(SetFollowUpSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.encounters.setFollowUp.run({ input }, { actorId }),
			);
		} catch (error) {
			throw new Error(
				`Follow-up save failed (${error instanceof Error ? error.message : "unknown error"}); verify the encounter is Open and retry`,
			);
		}
	});

export const addendum = scopedAuthMiddleware
	.input(AddEncounterAddendumSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.encounters.addendum.run({ input }, { actorId }),
			);
		} catch (error) {
			throw new Error(
				`Addendum save failed (${error instanceof Error ? error.message : "unknown error"}); check the encounter and retry`,
			);
		}
	});
