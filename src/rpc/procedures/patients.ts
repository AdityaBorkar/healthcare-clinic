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
import { authed } from "../middlewares/auth";
import { requireOrganizationSlug } from "../utils/subdomain";
import { resolveTenantDatabaseName } from "../utils/workspace-organization";

export const register = authed
	.input(PatientRegisterSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		try {
			return await pm.run(dbName, () =>
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
					{ actorId: context.session.user.id },
				),
			);
		} catch (error) {
			throw new Error(
				`Patient registration failed (${error instanceof Error ? error.message : "unknown error"}); verify phone/ABHA and retry`,
			);
		}
	});

export const dedupeCheck = authed
	.input(DedupeCheckSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		try {
			return await pm.run(dbName, () =>
				pm.healthcare.patients.dedupeCheck.run(
					{
						input: {
							abha: input.abha,
							branchId: input.branchId,
							phone: input.phone,
						},
					},
					{ actorId: context.session.user.id },
				),
			);
		} catch (error) {
			throw new Error(
				`Duplicate check failed (${error instanceof Error ? error.message : "unknown error"}); retry the search`,
			);
		}
	});

export const get = authed
	.input(PatientIdSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		try {
			return await pm.run(dbName, () =>
				pm.healthcare.patients.get.run(
					{ input: { id: input.id } },
					{ actorId: context.session.user.id },
				),
			);
		} catch (error) {
			throw new Error(
				`Patient lookup failed (${error instanceof Error ? error.message : "unknown error"}); check the UHID and retry`,
			);
		}
	});

export const list = authed
	.input(PatientListSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		try {
			return await pm.run(dbName, () =>
				pm.healthcare.patients.list.run(
					{
						input: {
							branchId: input.branchId,
							limit: Number.parseInt(input.limit, 10) || 100,
						},
					},
					{ actorId: context.session.user.id },
				),
			);
		} catch (error) {
			throw new Error(
				`Patient list failed (${error instanceof Error ? error.message : "unknown error"}); retry`,
			);
		}
	});

export const timeline = authed
	.input(PatientIdSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		try {
			return await pm.run(dbName, () =>
				pm.healthcare.patients.timeline.run(
					{ input: { id: input.id } },
					{ actorId: context.session.user.id },
				),
			);
		} catch (error) {
			throw new Error(
				`Patient timeline failed (${error instanceof Error ? error.message : "unknown error"}); check the UHID and retry`,
			);
		}
	});

export const linkFamily = authed
	.input(FamilyLinkSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		try {
			return await pm.run(dbName, () =>
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
					{ actorId: context.session.user.id },
				),
			);
		} catch (error) {
			throw new Error(
				`Family link failed (${error instanceof Error ? error.message : "unknown error"}); verify the patient and retry`,
			);
		}
	});

export const setFlag = authed
	.input(FlagSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		try {
			return await pm.run(dbName, () =>
				pm.healthcare.patients.setFlag.run(
					{
						input: {
							branchId: input.branchId,
							label: input.label,
							level: input.level,
							patientId: input.patientId,
						},
					},
					{ actorId: context.session.user.id },
				),
			);
		} catch (error) {
			throw new Error(
				`Setting patient flag failed (${error instanceof Error ? error.message : "unknown error"}); verify the patient and retry`,
			);
		}
	});

export const addAllergy = authed
	.input(AllergySchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		try {
			return await pm.run(dbName, () =>
				pm.healthcare.patients.addAllergy.run(
					{
						input: {
							branchId: input.branchId,
							name: input.name,
							note: input.note,
							patientId: input.patientId,
							severity: input.severity,
						},
					},
					{ actorId: context.session.user.id },
				),
			);
		} catch (error) {
			throw new Error(
				`Recording allergy failed (${error instanceof Error ? error.message : "unknown error"}); verify the patient and retry`,
			);
		}
	});

export const archiveConsent = authed
	.input(ConsentSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		try {
			return await pm.run(dbName, () =>
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
					{ actorId: context.session.user.id },
				),
			);
		} catch (error) {
			throw new Error(
				`Archiving consent failed (${error instanceof Error ? error.message : "unknown error"}); verify the patient and retry`,
			);
		}
	});

export const logCommunication = authed
	.input(CommunicationLogSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		try {
			return await pm.run(dbName, () =>
				pm.healthcare.patients.logCommunication.run(
					{
						input: {
							branchId: input.branchId,
							channel: input.channel,
							message: input.message,
							patientId: input.patientId,
						},
					},
					{ actorId: context.session.user.id },
				),
			);
		} catch (error) {
			throw new Error(
				`Logging communication failed (${error instanceof Error ? error.message : "unknown error"}); verify the patient and retry`,
			);
		}
	});

export const shareSlip = authed
	.input(PatientIdSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		try {
			return await pm.run(dbName, () =>
				pm.healthcare.patients.shareSlip.run(
					{ input: { id: input.id } },
					{ actorId: context.session.user.id },
				),
			);
		} catch (error) {
			throw new Error(
				`Share slip failed (${error instanceof Error ? error.message : "unknown error"}); check the UHID and retry`,
			);
		}
	});

export const enrolRecall = authed
	.input(RecallEnrolSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		try {
			return await pm.run(dbName, () =>
				pm.healthcare.patients.enrolRecall.run(
					{
						input: {
							at: input.at,
							branchId: input.branchId,
							patientId: input.patientId,
							reason: input.reason,
						},
					},
					{ actorId: context.session.user.id },
				),
			);
		} catch (error) {
			throw new Error(
				`Recall enrolment failed (${error instanceof Error ? error.message : "unknown error"}); verify the patient and retry`,
			);
		}
	});

export const requestMerge = authed
	.input(MergeRequestSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		try {
			return await pm.run(dbName, () =>
				pm.healthcare.patients.requestMerge.run(
					{
						input: {
							branchId: input.branchId,
							duplicateId: input.duplicateId,
							primaryId: input.primaryId,
							reason: input.reason,
						},
					},
					{ actorId: context.session.user.id },
				),
			);
		} catch (error) {
			throw new Error(
				`Merge request failed (${error instanceof Error ? error.message : "unknown error"}); verify both patient IDs and retry`,
			);
		}
	});

export const approveMerge = authed
	.input(ApproveMergeSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		try {
			return await pm.run(dbName, () =>
				pm.healthcare.patients.approveMerge.run(
					{ input: { id: input.id } },
					{ actorId: context.session.user.id },
				),
			);
		} catch (error) {
			throw new Error(
				`Merge approval failed (${error instanceof Error ? error.message : "unknown error"}); verify the request and retry`,
			);
		}
	});
