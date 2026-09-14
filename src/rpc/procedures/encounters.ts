import {
	AddendumSchema,
	DiagnosisSchema,
	EncounterCreateSchema,
	EncounterIdSchema,
	FollowUpSchema,
	OrderSchema,
	PrescriptionSchema,
	RefillSchema,
	VitalsSchema,
} from "#/schemas/encounters";
import { scopedAuthMiddleware } from "../middlewares/scoped_auth";

export const create = scopedAuthMiddleware
	.input(EncounterCreateSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.encounters.create.run(
					{
						input: {
							appointmentId: input.appointmentId,
							branchId: input.branchId,
							patientId: input.patientId,
							specialty: input.specialty,
							visitType: input.visitType,
						},
					},
					{ actorId },
				),
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
				pm.healthcare.encounters.get.run(
					{ input: { id: input.id } },
					{ actorId },
				),
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
				pm.healthcare.encounters.sign.run(
					{ input: { id: input.id } },
					{ actorId },
				),
			);
		} catch (error) {
			throw new Error(
				`Encounter sign failed (${error instanceof Error ? error.message : "unknown error"}); check the ID and retry`,
			);
		}
	});

export const addDiagnosis = scopedAuthMiddleware
	.input(DiagnosisSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.encounters.addDiagnosis.run(
					{
						input: {
							code: input.code,
							encounterId: input.encounterId,
							kind: input.kind ?? "provisional",
							label: input.label,
							patientId: input.patientId,
							primary: input.primary,
						},
					},
					{ actorId },
				),
			);
		} catch (error) {
			throw new Error(
				`Diagnosis save failed (${error instanceof Error ? error.message : "unknown error"}); verify the encounter is Open and retry`,
			);
		}
	});

export const prescribe = scopedAuthMiddleware
	.input(PrescriptionSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.encounters.prescribe.run(
					{
						input: {
							acknowledgedWarnings: input.acknowledgedWarnings,
							encounterId: input.encounterId,
							items: input.items,
							patientId: input.patientId,
						},
					},
					{ actorId },
				),
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
				pm.healthcare.encounters.refill.run(
					{
						input: {
							encounterId: input.encounterId,
							patientId: input.patientId,
							prescriptionId: input.prescriptionId,
						},
					},
					{ actorId },
				),
			);
		} catch (error) {
			throw new Error(
				`Refill failed (${error instanceof Error ? error.message : "unknown error"}); verify the encounter is Open and retry`,
			);
		}
	});

export const placeOrder = scopedAuthMiddleware
	.input(OrderSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.encounters.placeOrder.run(
					{
						input: {
							encounterId: input.encounterId,
							item: input.item,
							kind: input.kind,
							note: input.note,
							patientId: input.patientId,
							receivingUnit: input.receivingUnit,
						},
					},
					{ actorId },
				),
			);
		} catch (error) {
			throw new Error(
				`Order placement failed (${error instanceof Error ? error.message : "unknown error"}); verify the encounter is Open and retry`,
			);
		}
	});

export const recordVitals = scopedAuthMiddleware
	.input(VitalsSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.encounters.recordVitals.run(
					{
						input: {
							bp: input.bp,
							encounterId: input.encounterId,
							patientId: input.patientId,
							pulse: input.pulse,
							spo2: input.spo2,
							tempC: input.tempC,
							weightKg: input.weightKg,
						},
					},
					{ actorId },
				),
			);
		} catch (error) {
			throw new Error(
				`Vitals save failed (${error instanceof Error ? error.message : "unknown error"}); verify the encounter is Open and retry`,
			);
		}
	});

export const setFollowUp = scopedAuthMiddleware
	.input(FollowUpSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.encounters.setFollowUp.run(
					{
						input: {
							at: input.at,
							encounterId: input.encounterId,
							note: input.note,
							patientId: input.patientId,
						},
					},
					{ actorId },
				),
			);
		} catch (error) {
			throw new Error(
				`Follow-up save failed (${error instanceof Error ? error.message : "unknown error"}); verify the encounter is Open and retry`,
			);
		}
	});

export const addendum = scopedAuthMiddleware
	.input(AddendumSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.encounters.addendum.run(
					{
						input: {
							encounterId: input.encounterId,
							note: input.note,
						},
					},
					{ actorId },
				),
			);
		} catch (error) {
			throw new Error(
				`Addendum save failed (${error instanceof Error ? error.message : "unknown error"}); check the encounter and retry`,
			);
		}
	});
