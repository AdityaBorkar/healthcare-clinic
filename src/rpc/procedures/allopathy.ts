// NOTE: `pm` is lazily imported inside handlers (not statically) because the
// clinic track contract forbids top-level pm/router imports in procedures.
import {
	ChronicLogInputSchema,
	EncounterFilterSchema,
	ExamFindingInputSchema,
	ImmunizationInputSchema,
	RegisterEntryInputSchema,
	SoapNoteInputSchema,
	TriageEntryInputSchema,
} from "#/schemas/allopathy";
import { authed } from "../middlewares/auth";
import { requireOrganizationSlug } from "../utils/subdomain";
import { resolveTenantDatabaseName } from "../utils/workspace-organization";

export const saveSoap = authed
	.input(SoapNoteInputSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.allopathy.saveSoap.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const saveExam = authed
	.input(ExamFindingInputSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.allopathy.saveExam.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const logChronic = authed
	.input(ChronicLogInputSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.allopathy.logChronic.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const recordImmunization = authed
	.input(ImmunizationInputSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.allopathy.recordImmunization.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const triageEntry = authed
	.input(TriageEntryInputSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.allopathy.triageEntry.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const registerEntry = authed
	.input(RegisterEntryInputSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.allopathy.registerEntry.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const listSoap = authed
	.input(EncounterFilterSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.allopathy.listSoap.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});
