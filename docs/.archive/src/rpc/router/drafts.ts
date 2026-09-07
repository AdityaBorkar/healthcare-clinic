import { desc, eq } from "drizzle-orm";
import * as v from "valibot";

import { FORM_TYPES } from "#/lib/actions/forms";
import { db } from "#/lib/db/server";
import { AuthProcedure } from "#/rpc/procedure";
import { drafts } from "#/schemas/db";

const createDraftSchema = v.object({
	data: v.record(v.string(), v.unknown()),
	formType: v.string(),
	label: v.optional(v.string()),
});

export const createDraft = AuthProcedure.meta({
	permissions: ["drafts:write"],
})
	.input(createDraftSchema)
	.handler(async ({ input }) => {
		const label =
			input.label ||
			(input.data.name as string) ||
			(input.data.label as string) ||
			`New ${FORM_TYPES[input.formType as keyof typeof FORM_TYPES]?.label ?? input.formType}`;

		const [draft] = await db
			.insert(drafts)
			.values({
				data: input.data,
				formType: input.formType,
				label,
			})
			.returning();

		return draft;
	});

export const updateDraft = AuthProcedure.meta({
	permissions: ["drafts:write"],
})
	.input(
		v.object({
			data: v.record(v.string(), v.unknown()),
			id: v.number(),
			label: v.optional(v.string()),
		}),
	)
	.handler(async ({ input }) => {
		const label =
			input.label ||
			(input.data.name as string) ||
			(input.data.label as string);

		const [draft] = await db
			.update(drafts)
			.set({
				data: input.data,
				...(label ? { label } : {}),
				updatedAt: new Date(),
			})
			.where(eq(drafts.id, input.id))
			.returning();

		if (!draft) {
			throw new Error("Draft not found");
		}

		return draft;
	});

export const getDraft = AuthProcedure.meta({ permissions: ["drafts:read"] })
	.input(v.object({ id: v.number() }))
	.handler(async ({ input }) => {
		const draft = await db.query.drafts.findFirst({
			where: eq(drafts.id, input.id),
		});
		if (!draft) {
			throw new Error("Draft not found");
		}
		return draft;
	});

export const listDrafts = AuthProcedure.meta({ permissions: ["drafts:read"] })
	.input(
		v.object({
			formType: v.optional(v.string()),
		}),
	)
	.handler(async ({ input }) => {
		const result = await db.query.drafts.findMany({
			orderBy: [desc(drafts.updatedAt)],
			where: input.formType ? eq(drafts.formType, input.formType) : undefined,
		});
		return result;
	});

export const deleteDraft = AuthProcedure.meta({
	permissions: ["drafts:delete"],
})
	.input(v.object({ id: v.number() }))
	.handler(async ({ input }) => {
		await db.delete(drafts).where(eq(drafts.id, input.id));
		return { id: input.id };
	});
