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
import { authed } from "../middlewares/auth";
import { requireOrganizationSlug } from "../utils/subdomain";
import { resolveTenantDatabaseName } from "../utils/workspace-organization";

export const create = authed
	.input(EncounterCreateSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		try {
			return await pm.run(dbName, () =>
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
					{ actorId: context.session.user.id },
				),
			);
		} catch (error) {
			throw new Error(
				`Encounter creation failed (${error instanceof Error ? error.message : "unknown error"}); verify the patient and retry`,
			);
		}
	});

export const get = authed
	.input(EncounterIdSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		try {
			return await pm.run(dbName, () =>
				pm.healthcare.encounters.get.run(
					{ input: { id: input.id } },
					{ actorId: context.session.user.id },
				),
			);
		} catch (error) {
			throw new Error(
				`Encounter lookup failed (${error instanceof Error ? error.message : "unknown error"}); check the ID and retry`,
			);
		}
	});

export const sign = authed
	.input(EncounterIdSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		try {
			return await pm.run(dbName, () =>
				pm.healthcare.encounters.sign.run(
					{ input: { id: input.id } },
					{ actorId: context.session.user.id },
				),
			);
		} catch (error) {
			throw new Error(
				`Encounter sign failed (${error instanceof Error ? error.message : "unknown error"}); check the ID and retry`,
			);
		}
	});

export const addDiagnosis = authed
	.input(DiagnosisSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		try {
			return await pm.run(dbName, () =>
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
					{ actorId: context.session.user.id },
				),
			);
		} catch (error) {
			throw new Error(
				`Diagnosis save failed (${error instanceof Error ? error.message : "unknown error"}); verify the encounter is Open and retry`,
			);
		}
	});

export const prescribe = authed
	.input(PrescriptionSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		try {
			return await pm.run(dbName, () =>
				pm.healthcare.encounters.prescribe.run(
					{
						input: {
							acknowledgedWarnings: input.acknowledgedWarnings,
							encounterId: input.encounterId,
							items: input.items,
							patientId: input.patientId,
						},
					},
					{ actorId: context.session.user.id },
				),
			);
		} catch (error) {
			throw new Error(
				`Prescription save failed (${error instanceof Error ? error.message : "unknown error"}); verify the encounter is Open and retry`,
			);
		}
	});

export const refill = authed
	.input(RefillSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		try {
			return await pm.run(dbName, () =>
				pm.healthcare.encounters.refill.run(
					{
						input: {
							encounterId: input.encounterId,
							patientId: input.patientId,
							prescriptionId: input.prescriptionId,
						},
					},
					{ actorId: context.session.user.id },
				),
			);
		} catch (error) {
			throw new Error(
				`Refill failed (${error instanceof Error ? error.message : "unknown error"}); verify the encounter is Open and retry`,
			);
		}
	});

export const placeOrder = authed
	.input(OrderSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		try {
			return await pm.run(dbName, () =>
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
					{ actorId: context.session.user.id },
				),
			);
		} catch (error) {
			throw new Error(
				`Order placement failed (${error instanceof Error ? error.message : "unknown error"}); verify the encounter is Open and retry`,
			);
		}
	});

export const recordVitals = authed
	.input(VitalsSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		try {
			return await pm.run(dbName, () =>
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
					{ actorId: context.session.user.id },
				),
			);
		} catch (error) {
			throw new Error(
				`Vitals save failed (${error instanceof Error ? error.message : "unknown error"}); verify the encounter is Open and retry`,
			);
		}
	});

export const setFollowUp = authed
	.input(FollowUpSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		try {
			return await pm.run(dbName, () =>
				pm.healthcare.encounters.setFollowUp.run(
					{
						input: {
							at: input.at,
							encounterId: input.encounterId,
							note: input.note,
							patientId: input.patientId,
						},
					},
					{ actorId: context.session.user.id },
				),
			);
		} catch (error) {
			throw new Error(
				`Follow-up save failed (${error instanceof Error ? error.message : "unknown error"}); verify the encounter is Open and retry`,
			);
		}
	});

export const addendum = authed
	.input(AddendumSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		try {
			return await pm.run(dbName, () =>
				pm.healthcare.encounters.addendum.run(
					{
						input: {
							encounterId: input.encounterId,
							note: input.note,
						},
					},
					{ actorId: context.session.user.id },
				),
			);
		} catch (error) {
			throw new Error(
				`Addendum save failed (${error instanceof Error ? error.message : "unknown error"}); check the encounter and retry`,
			);
		}
	});
