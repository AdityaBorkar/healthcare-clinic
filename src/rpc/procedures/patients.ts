import {
	AllergySchema,
	ApproveMergeSchema,
	CommunicationLogSchema,
	ConsentSchema,
	DedupeCheckSchema,
	FamilyLinkSchema,
	FlagSchema,
	MergeRequestSchema,
	PatientIdSchema,
	PatientListSchema,
	PatientRegisterSchema,
	RecallEnrolSchema,
} from "#/schemas/patients";
import { scopedAuthMiddleware } from "../middlewares/scoped_auth";

export const register = scopedAuthMiddleware
	.input(PatientRegisterSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.patients.register.run(
					{
						input: {
							abha: input.abha,
							allergies: input.allergies,
							branchId: input.branchId,
							dob: input.dob,
							fullName: input.fullName,
							gender: input.gender,
							guardian: input.guardian,
							language: input.language,
							phone: input.phone,
						},
					},
					{ actorId },
				),
			);
		} catch (error) {
			throw new Error(
				`Patient registration failed (${error instanceof Error ? error.message : "unknown error"}); verify phone/ABHA and retry`,
			);
		}
	});

export const dedupeCheck = scopedAuthMiddleware
	.input(DedupeCheckSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.patients.dedupeCheck.run(
					{
						input: {
							abha: input.abha,
							branchId: input.branchId,
							phone: input.phone,
						},
					},
					{ actorId },
				),
			);
		} catch (error) {
			throw new Error(
				`Duplicate check failed (${error instanceof Error ? error.message : "unknown error"}); retry the search`,
			);
		}
	});

export const get = scopedAuthMiddleware
	.input(PatientIdSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.patients.get.run(
					{ input: { id: input.id } },
					{ actorId },
				),
			);
		} catch (error) {
			throw new Error(
				`Patient lookup failed (${error instanceof Error ? error.message : "unknown error"}); check the UHID and retry`,
			);
		}
	});

export const list = scopedAuthMiddleware
	.input(PatientListSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.patients.list.run(
					{
						input: {
							branchId: input.branchId,
							limit: Number.parseInt(input.limit, 10) || 100,
						},
					},
					{ actorId },
				),
			);
		} catch (error) {
			throw new Error(
				`Patient list failed (${error instanceof Error ? error.message : "unknown error"}); retry`,
			);
		}
	});

export const timeline = scopedAuthMiddleware
	.input(PatientIdSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.patients.timeline.run(
					{ input: { id: input.id } },
					{ actorId },
				),
			);
		} catch (error) {
			throw new Error(
				`Patient timeline failed (${error instanceof Error ? error.message : "unknown error"}); check the UHID and retry`,
			);
		}
	});

export const linkFamily = scopedAuthMiddleware
	.input(FamilyLinkSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.patients.linkFamily.run(
					{
						input: {
							branchId: input.branchId,
							linkedName: input.linkedName,
							linkedPhone: input.linkedPhone,
							patientId: input.patientId,
							relation: input.relation,
						},
					},
					{ actorId },
				),
			);
		} catch (error) {
			throw new Error(
				`Family link failed (${error instanceof Error ? error.message : "unknown error"}); verify the patient and retry`,
			);
		}
	});

export const setFlag = scopedAuthMiddleware
	.input(FlagSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.patients.setFlag.run(
					{
						input: {
							branchId: input.branchId,
							label: input.label,
							level: input.level,
							patientId: input.patientId,
						},
					},
					{ actorId },
				),
			);
		} catch (error) {
			throw new Error(
				`Setting patient flag failed (${error instanceof Error ? error.message : "unknown error"}); verify the patient and retry`,
			);
		}
	});

export const addAllergy = scopedAuthMiddleware
	.input(AllergySchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.patients.addAllergy.run(
					{
						input: {
							branchId: input.branchId,
							name: input.name,
							note: input.note,
							patientId: input.patientId,
							reaction: input.reaction,
							severity: input.severity,
						},
					},
					{ actorId },
				),
			);
		} catch (error) {
			throw new Error(
				`Recording allergy failed (${error instanceof Error ? error.message : "unknown error"}); verify the patient and retry`,
			);
		}
	});

export const archiveConsent = scopedAuthMiddleware
	.input(ConsentSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.patients.archiveConsent.run(
					{
						input: {
							branchId: input.branchId,
							granted: input.granted,
							note: input.note,
							patientId: input.patientId,
							type: input.type,
						},
					},
					{ actorId },
				),
			);
		} catch (error) {
			throw new Error(
				`Archiving consent failed (${error instanceof Error ? error.message : "unknown error"}); verify the patient and retry`,
			);
		}
	});

export const logCommunication = scopedAuthMiddleware
	.input(CommunicationLogSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.patients.logCommunication.run(
					{
						input: {
							branchId: input.branchId,
							channel: input.channel,
							message: input.message,
							patientId: input.patientId,
						},
					},
					{ actorId },
				),
			);
		} catch (error) {
			throw new Error(
				`Logging communication failed (${error instanceof Error ? error.message : "unknown error"}); verify the patient and retry`,
			);
		}
	});

export const shareSlip = scopedAuthMiddleware
	.input(PatientIdSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.patients.shareSlip.run(
					{ input: { id: input.id } },
					{ actorId },
				),
			);
		} catch (error) {
			throw new Error(
				`Share slip failed (${error instanceof Error ? error.message : "unknown error"}); check the UHID and retry`,
			);
		}
	});

export const enrolRecall = scopedAuthMiddleware
	.input(RecallEnrolSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.patients.enrolRecall.run(
					{
						input: {
							at: input.at,
							branchId: input.branchId,
							patientId: input.patientId,
							reason: input.reason,
						},
					},
					{ actorId },
				),
			);
		} catch (error) {
			throw new Error(
				`Recall enrolment failed (${error instanceof Error ? error.message : "unknown error"}); verify the patient and retry`,
			);
		}
	});

export const requestMerge = scopedAuthMiddleware
	.input(MergeRequestSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.patients.requestMerge.run(
					{
						input: {
							branchId: input.branchId,
							duplicateId: input.duplicateId,
							primaryId: input.primaryId,
							reason: input.reason,
						},
					},
					{ actorId },
				),
			);
		} catch (error) {
			throw new Error(
				`Merge request failed (${error instanceof Error ? error.message : "unknown error"}); verify both patient IDs and retry`,
			);
		}
	});

export const approveMerge = scopedAuthMiddleware
	.input(ApproveMergeSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.patients.approveMerge.run(
					{ input: { id: input.id } },
					{ actorId },
				),
			);
		} catch (error) {
			throw new Error(
				`Merge approval failed (${error instanceof Error ? error.message : "unknown error"}); verify the request and retry`,
			);
		}
	});
