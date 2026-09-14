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
import { authMiddleware } from "../middlewares/auth";
import { requireOrganizationSlug } from "../utils/subdomain";
import { resolveTenantDatabaseName } from "../utils/workspace-organization";

export const saveSoap = authMiddleware
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

export const saveExam = authMiddleware
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

export const logChronic = authMiddleware
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

export const recordImmunization = authMiddleware
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

export const triageEntry = authMiddleware
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

export const registerEntry = authMiddleware
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

export const listSoap = authMiddleware
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

export const problemUpsert = authMiddleware
	.input(ProblemUpsertSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.allopathy.problemUpsert.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const problemList = authMiddleware
	.input(ProblemListFilterSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.allopathy.problemList.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const checkInteraction = authMiddleware
	.input(InteractionCheckSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.allopathy.checkInteraction.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});
