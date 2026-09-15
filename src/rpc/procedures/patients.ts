import {
	ApproveMergeSchema,
	ArchiveConsentSchema,
	CreateAllergySchema,
	CreateFamilyLinkSchema,
	CreateFlagSchema,
	CreatePatientSchema,
	DedupeCheckSchema,
	EnrolRecallSchema,
	LogCommunicationSchema,
	PatientFiltersSchema,
	PatientIdSchema,
	RequestMergeSchema,
} from "@aspen-os/healthcare";

import { scopedAuthMiddleware } from "../middlewares/scoped_auth";

export const register = scopedAuthMiddleware
	.input(CreatePatientSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.patients.register.run({ input }, { actorId }),
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
				pm.healthcare.patients.dedupeCheck.run({ input }, { actorId }),
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
				pm.healthcare.patients.get.run({ input }, { actorId }),
			);
		} catch (error) {
			throw new Error(
				`Patient lookup failed (${error instanceof Error ? error.message : "unknown error"}); check the UHID and retry`,
			);
		}
	});

export const list = scopedAuthMiddleware
	.input(PatientFiltersSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.patients.list.run({ input }, { actorId }),
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
				pm.healthcare.patients.timeline.run({ input }, { actorId }),
			);
		} catch (error) {
			throw new Error(
				`Patient timeline failed (${error instanceof Error ? error.message : "unknown error"}); check the UHID and retry`,
			);
		}
	});

export const linkFamily = scopedAuthMiddleware
	.input(CreateFamilyLinkSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.patients.linkFamily.run({ input }, { actorId }),
			);
		} catch (error) {
			throw new Error(
				`Family link failed (${error instanceof Error ? error.message : "unknown error"}); verify the patient and retry`,
			);
		}
	});

export const setFlag = scopedAuthMiddleware
	.input(CreateFlagSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.patients.setFlag.run({ input }, { actorId }),
			);
		} catch (error) {
			throw new Error(
				`Setting patient flag failed (${error instanceof Error ? error.message : "unknown error"}); verify the patient and retry`,
			);
		}
	});

export const addAllergy = scopedAuthMiddleware
	.input(CreateAllergySchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.patients.addAllergy.run({ input }, { actorId }),
			);
		} catch (error) {
			throw new Error(
				`Recording allergy failed (${error instanceof Error ? error.message : "unknown error"}); verify the patient and retry`,
			);
		}
	});

export const archiveConsent = scopedAuthMiddleware
	.input(ArchiveConsentSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.patients.archiveConsent.run({ input }, { actorId }),
			);
		} catch (error) {
			throw new Error(
				`Archiving consent failed (${error instanceof Error ? error.message : "unknown error"}); verify the patient and retry`,
			);
		}
	});

export const logCommunication = scopedAuthMiddleware
	.input(LogCommunicationSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.patients.logCommunication.run({ input }, { actorId }),
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
				pm.healthcare.patients.shareSlip.run({ input }, { actorId }),
			);
		} catch (error) {
			throw new Error(
				`Share slip failed (${error instanceof Error ? error.message : "unknown error"}); check the UHID and retry`,
			);
		}
	});

export const enrolRecall = scopedAuthMiddleware
	.input(EnrolRecallSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.patients.enrolRecall.run({ input }, { actorId }),
			);
		} catch (error) {
			throw new Error(
				`Recall enrolment failed (${error instanceof Error ? error.message : "unknown error"}); verify the patient and retry`,
			);
		}
	});

export const requestMerge = scopedAuthMiddleware
	.input(RequestMergeSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.patients.requestMerge.run({ input }, { actorId }),
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
				pm.healthcare.patients.approveMerge.run({ input }, { actorId }),
			);
		} catch (error) {
			throw new Error(
				`Merge approval failed (${error instanceof Error ? error.message : "unknown error"}); verify the request and retry`,
			);
		}
	});
