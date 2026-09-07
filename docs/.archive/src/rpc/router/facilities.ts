import { and, eq } from "drizzle-orm";
import * as v from "valibot";

import { db } from "#/lib/db/server";
import { AuthProcedure } from "#/rpc/procedure";
import {
	facilities,
	facilityCategories,
	facilitySchedules,
} from "#/schemas/db";

const createCategorySchema = v.object({
	code: v.pipe(v.string(), v.nonEmpty("Code is required")),
	colorCode: v.pipe(v.string(), v.nonEmpty("Color is required")),
	description: v.optional(v.string()),
	name: v.pipe(v.string(), v.nonEmpty("Name is required")),
});

const updateCategorySchema = v.object({
	code: v.optional(v.string()),
	colorCode: v.optional(v.string()),
	description: v.optional(v.string()),
	id: v.number(),
	isActive: v.optional(v.boolean()),
	name: v.optional(v.string()),
});

const createFacilitySchema = v.object({
	categoryId: v.pipe(v.number(), v.minValue(1, "Category is required")),
	code: v.pipe(v.string(), v.nonEmpty("Code is required")),
	description: v.optional(v.string()),
	isBed: v.optional(v.boolean(), false),
	name: v.pipe(v.string(), v.nonEmpty("Name is required")),
	quantity: v.optional(
		v.pipe(v.number(), v.minValue(1, "Quantity must be at least 1")),
		1,
	),
});

const updateFacilitySchema = v.object({
	categoryId: v.optional(v.number()),
	code: v.optional(v.string()),
	description: v.optional(v.string()),
	id: v.number(),
	isActive: v.optional(v.boolean()),
	isBed: v.optional(v.boolean()),
	name: v.optional(v.string()),
	quantity: v.optional(v.pipe(v.number(), v.minValue(1))),
});

const listFacilitiesSchema = v.object({
	categoryId: v.optional(v.number()),
	isActive: v.optional(v.boolean()),
	search: v.optional(v.string()),
});

const createFacilityScheduleSchema = v.object({
	dayOfWeek: v.pipe(v.number(), v.minValue(0), v.maxValue(6)),
	endTime: v.pipe(v.string(), v.regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)),
	facilityId: v.number(),
	isActive: v.optional(v.boolean(), true),
	startTime: v.pipe(v.string(), v.regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)),
});

const updateFacilityScheduleSchema = v.object({
	dayOfWeek: v.optional(v.pipe(v.number(), v.minValue(0), v.maxValue(6))),
	endTime: v.optional(
		v.pipe(v.string(), v.regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)),
	),
	id: v.number(),
	isActive: v.optional(v.boolean()),
	startTime: v.optional(
		v.pipe(v.string(), v.regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)),
	),
});

export interface FacilityWithSchedules {
	category: {
		code: string;
		colorCode: string;
		id: number;
		name: string;
	};
	categoryId: number;
	code: string;
	createdAt: Date | null;
	description: string | null;
	id: number;
	isActive: boolean;
	isBed: boolean;
	name: string;
	quantity: number;
	schedules: Array<{
		createdAt: Date | null;
		dayOfWeek: number;
		endTime: string;
		facilityId: number;
		id: number;
		isActive: boolean;
		startTime: string;
		updatedAt: Date | null;
	}>;
	updatedAt: Date | null;
}

export interface FacilityCategory {
	code: string;
	colorCode: string;
	createdAt: Date | null;
	description: string | null;
	id: number;
	isActive: boolean;
	name: string;
	updatedAt: Date | null;
}

export const listCategories = AuthProcedure.meta({
	permissions: ["facilities:read"],
})
	.input(
		v.object({
			isActive: v.optional(v.boolean()),
		}),
	)
	.handler(async ({ input }) => {
		const conditions = [];

		if (input.isActive !== undefined) {
			conditions.push(eq(facilityCategories.isActive, input.isActive));
		}

		const categoryList = await db.query.facilityCategories.findMany({
			orderBy: (facilityCategories, { asc }) => [asc(facilityCategories.name)],
			where: conditions.length > 0 ? and(...conditions) : undefined,
		});

		return categoryList;
	});

export const getCategory = AuthProcedure.meta({
	permissions: ["facilities:read"],
})
	.input(v.object({ id: v.number() }))
	.handler(async ({ input }) => {
		const category = await db.query.facilityCategories.findFirst({
			where: eq(facilityCategories.id, input.id),
		});

		if (!category) {
			throw new Error("Category not found");
		}

		return category;
	});

export const createCategory = AuthProcedure.meta({
	permissions: ["facilities:write"],
})
	.input(createCategorySchema)
	.handler(async ({ input }) => {
		const existing = await db.query.facilityCategories.findFirst({
			where: eq(facilityCategories.code, input.code),
		});

		if (existing) {
			throw new Error(`Category code "${input.code}" already exists`);
		}

		const [category] = await db
			.insert(facilityCategories)
			.values(input)
			.returning();

		return category;
	});

export const updateCategory = AuthProcedure.meta({
	permissions: ["facilities:write"],
})
	.input(updateCategorySchema)
	.handler(async ({ input }) => {
		const { id, ...updateData } = input;

		if (updateData.code) {
			const existing = await db.query.facilityCategories.findFirst({
				where: eq(facilityCategories.code, updateData.code),
			});

			if (existing && existing.id !== id) {
				throw new Error(`Category code "${updateData.code}" already exists`);
			}
		}

		const [updated] = await db
			.update(facilityCategories)
			.set({ ...updateData, updatedAt: new Date() })
			.where(eq(facilityCategories.id, id))
			.returning();

		if (!updated) {
			throw new Error("Category not found");
		}

		return updated;
	});

export const deleteCategory = AuthProcedure.meta({
	permissions: ["facilities:delete"],
})
	.input(v.object({ id: v.number() }))
	.handler(async ({ input }) => {
		const [_updated] = await db
			.update(facilityCategories)
			.set({ isActive: false, updatedAt: new Date() })
			.where(eq(facilityCategories.id, input.id))
			.returning();

		return {
			message: "Category deactivated successfully",
			success: true,
		};
	});

export const listFacilities = AuthProcedure.meta({
	permissions: ["facilities:read"],
})
	.input(listFacilitiesSchema)
	.handler(async ({ input }) => {
		const conditions = [];

		if (input.isActive !== undefined) {
			conditions.push(eq(facilities.isActive, input.isActive));
		}

		if (input.categoryId) {
			conditions.push(eq(facilities.categoryId, input.categoryId));
		}

		let facilityList = await db.query.facilities.findMany({
			orderBy: (facilities, { asc }) => [asc(facilities.name)],
			where: conditions.length > 0 ? and(...conditions) : undefined,
			with: {
				category: {
					columns: {
						code: true,
						colorCode: true,
						id: true,
						name: true,
					},
				},
				schedules: {
					orderBy: (facilitySchedules, { asc }) => [
						asc(facilitySchedules.dayOfWeek),
						asc(facilitySchedules.startTime),
					],
				},
			},
		});

		if (input.search) {
			const searchLower = input.search.toLowerCase();
			facilityList = facilityList.filter(
				(f) =>
					f.name.toLowerCase().includes(searchLower) ||
					f.code.toLowerCase().includes(searchLower),
			);
		}

		return facilityList;
	});

export const getFacility = AuthProcedure.meta({
	permissions: ["facilities:read"],
})
	.input(v.object({ id: v.number() }))
	.handler(async ({ input }) => {
		const facility = await db.query.facilities.findFirst({
			where: eq(facilities.id, input.id),
			with: {
				category: {
					columns: {
						code: true,
						colorCode: true,
						id: true,
						name: true,
					},
				},
				schedules: {
					orderBy: (facilitySchedules, { asc }) => [
						asc(facilitySchedules.dayOfWeek),
						asc(facilitySchedules.startTime),
					],
				},
			},
		});

		if (!facility) {
			throw new Error("Facility not found");
		}

		return facility;
	});

export const createFacility = AuthProcedure.meta({
	permissions: ["facilities:write"],
})
	.input(createFacilitySchema)
	.handler(async ({ input }) => {
		const existing = await db.query.facilities.findFirst({
			where: eq(facilities.code, input.code),
		});

		if (existing) {
			throw new Error(`Facility code "${input.code}" already exists`);
		}

		const [facility] = await db.insert(facilities).values(input).returning();

		return facility;
	});

export const updateFacility = AuthProcedure.meta({
	permissions: ["facilities:write"],
})
	.input(updateFacilitySchema)
	.handler(async ({ input }) => {
		const { id, ...updateData } = input;

		if (updateData.code) {
			const existing = await db.query.facilities.findFirst({
				where: eq(facilities.code, updateData.code),
			});

			if (existing && existing.id !== id) {
				throw new Error(`Facility code "${updateData.code}" already exists`);
			}
		}

		const [updated] = await db
			.update(facilities)
			.set({ ...updateData, updatedAt: new Date() })
			.where(eq(facilities.id, id))
			.returning();

		if (!updated) {
			throw new Error("Facility not found");
		}

		return updated;
	});

export const deleteFacility = AuthProcedure.meta({
	permissions: ["facilities:delete"],
})
	.input(v.object({ id: v.number() }))
	.handler(async ({ input }) => {
		const [_updated] = await db
			.update(facilities)
			.set({ isActive: false, updatedAt: new Date() })
			.where(eq(facilities.id, input.id))
			.returning();

		return {
			message: "Facility deactivated successfully",
			success: true,
		};
	});

export const listFacilitySchedules = AuthProcedure.meta({
	permissions: ["facilities:read"],
})
	.input(v.object({ facilityId: v.number() }))
	.handler(async ({ input }) => {
		const scheduleList = await db.query.facilitySchedules.findMany({
			orderBy: (facilitySchedules, { asc }) => [
				asc(facilitySchedules.dayOfWeek),
				asc(facilitySchedules.startTime),
			],
			where: eq(facilitySchedules.facilityId, input.facilityId),
		});

		return scheduleList;
	});

export const createFacilitySchedule = AuthProcedure.meta({
	permissions: ["facilities:write"],
})
	.input(createFacilityScheduleSchema)
	.handler(async ({ input }) => {
		const [schedule] = await db
			.insert(facilitySchedules)
			.values(input)
			.returning();

		return schedule;
	});

export const updateFacilitySchedule = AuthProcedure.meta({
	permissions: ["facilities:write"],
})
	.input(updateFacilityScheduleSchema)
	.handler(async ({ input }) => {
		const { id, ...updateData } = input;

		const [updated] = await db
			.update(facilitySchedules)
			.set({ ...updateData, updatedAt: new Date() })
			.where(eq(facilitySchedules.id, id))
			.returning();

		if (!updated) {
			throw new Error("Schedule not found");
		}

		return updated;
	});

export const deleteFacilitySchedule = AuthProcedure.meta({
	permissions: ["facilities:delete"],
})
	.input(v.object({ id: v.number() }))
	.handler(async ({ input }) => {
		await db
			.delete(facilitySchedules)
			.where(eq(facilitySchedules.id, input.id));

		return { success: true };
	});
