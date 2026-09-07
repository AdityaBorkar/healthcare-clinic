import { and, eq } from "drizzle-orm";
import * as v from "valibot";

import { db } from "#/lib/db/server";
import { AuthProcedure } from "#/rpc/procedure";
import { specializations } from "#/schemas/db";

const createSpecializationSchema = v.object({
	code: v.optional(v.string()),
	description: v.optional(v.string()),
	name: v.pipe(v.string(), v.nonEmpty("Name is required")),
});

const updateSpecializationSchema = v.object({
	code: v.optional(v.string()),
	description: v.optional(v.string()),
	id: v.number(),
	isActive: v.optional(v.boolean()),
	name: v.optional(v.string()),
});

export const listSpecializations = AuthProcedure.meta({
	permissions: ["practitioners:read"],
})
	.input(
		v.object({
			isActive: v.optional(v.boolean()),
		}),
	)
	.handler(async ({ input }) => {
		const conditions = [];

		if (input.isActive !== undefined) {
			conditions.push(eq(specializations.isActive, input.isActive));
		}

		const specializationList = await db.query.specializations.findMany({
			orderBy: (specializations, { asc }) => [asc(specializations.name)],
			where: conditions.length > 0 ? and(...conditions) : undefined,
		});

		return specializationList;
	});

export const getSpecialization = AuthProcedure.meta({
	permissions: ["practitioners:read"],
})
	.input(v.object({ id: v.number() }))
	.handler(async ({ input }) => {
		const specialization = await db.query.specializations.findFirst({
			where: eq(specializations.id, input.id),
		});

		if (!specialization) {
			throw new Error("Specialization not found");
		}

		return specialization;
	});

export const createSpecialization = AuthProcedure.meta({
	permissions: ["practitioners:write"],
})
	.input(createSpecializationSchema)
	.handler(async ({ input }) => {
		if (input.code) {
			const existingCode = await db.query.specializations.findFirst({
				where: eq(specializations.code, input.code),
			});

			if (existingCode) {
				throw new Error(`Specialization code "${input.code}" already exists`);
			}
		}

		const [specialization] = await db
			.insert(specializations)
			.values(input)
			.returning();

		return specialization;
	});

export const updateSpecialization = AuthProcedure.meta({
	permissions: ["practitioners:write"],
})
	.input(updateSpecializationSchema)
	.handler(async ({ input }) => {
		const { id, ...updateData } = input;

		if (updateData.code) {
			const existingCode = await db.query.specializations.findFirst({
				where: eq(specializations.code, updateData.code),
			});

			if (existingCode && existingCode.id !== id) {
				throw new Error(
					`Specialization code "${updateData.code}" already exists`,
				);
			}
		}

		const [updated] = await db
			.update(specializations)
			.set({
				...updateData,
				updatedAt: new Date(),
			})
			.where(eq(specializations.id, id))
			.returning();

		if (!updated) {
			throw new Error("Specialization not found");
		}

		return updated;
	});

export const deleteSpecialization = AuthProcedure.meta({
	permissions: ["practitioners:delete"],
})
	.input(v.object({ id: v.number() }))
	.handler(async ({ input }) => {
		const [_updated] = await db
			.update(specializations)
			.set({
				isActive: false,
				updatedAt: new Date(),
			})
			.where(eq(specializations.id, input.id))
			.returning();

		return {
			message: "Specialization deactivated successfully",
			success: true,
		};
	});
