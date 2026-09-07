import { and, eq } from "drizzle-orm";
import * as v from "valibot";

import { db } from "#/lib/db/server";
import { AuthProcedure } from "#/rpc/procedure";
import { serviceFacilities, services } from "#/schemas/db";

const createServiceSchema = v.object({
	categoryId: v.pipe(v.number(), v.minValue(1, "Category is required")),
	code: v.pipe(v.string(), v.nonEmpty("Code is required")),
	cost: v.pipe(v.number(), v.minValue(0, "Cost must be non-negative")),
	description: v.optional(v.string()),
	duration: v.optional(v.number()),
	facilityIds: v.optional(v.array(v.number())),
	name: v.pipe(v.string(), v.nonEmpty("Name is required")),
});

const updateServiceSchema = v.object({
	categoryId: v.optional(v.number()),
	code: v.optional(v.string()),
	cost: v.optional(v.pipe(v.number(), v.minValue(0))),
	description: v.optional(v.string()),
	duration: v.optional(v.number()),
	facilityIds: v.optional(v.array(v.number())),
	id: v.number(),
	isActive: v.optional(v.boolean()),
	name: v.optional(v.string()),
});

const listServicesSchema = v.object({
	categoryId: v.optional(v.number()),
	isActive: v.optional(v.boolean()),
	search: v.optional(v.string()),
});

export interface ServiceWithFacilities {
	category: {
		code: string;
		colorCode: string;
		id: number;
		name: string;
	};
	categoryId: number;
	code: string;
	cost: number;
	createdAt: Date | null;
	description: string | null;
	duration: number | null;
	id: number;
	isActive: boolean;
	name: string;
	serviceFacilities: Array<{
		facility: {
			category: {
				code: string;
				colorCode: string;
				id: number;
				name: string;
			};
			code: string;
			id: number;
			isBed: boolean;
			name: string;
			quantity: number;
		};
		facilityId: number;
		id: number;
		serviceId: number;
	}>;
	updatedAt: Date | null;
}

export const listServices = AuthProcedure.meta({
	permissions: ["services:read"],
})
	.input(listServicesSchema)
	.handler(async ({ input }) => {
		const conditions = [];

		if (input.isActive !== undefined) {
			conditions.push(eq(services.isActive, input.isActive));
		}

		if (input.categoryId) {
			conditions.push(eq(services.categoryId, input.categoryId));
		}

		let serviceList = await db.query.services.findMany({
			orderBy: (services, { asc }) => [asc(services.name)],
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
				serviceFacilities: {
					with: {
						facility: {
							columns: {
								code: true,
								id: true,
								isBed: true,
								name: true,
								quantity: true,
							},
							with: {
								category: {
									columns: {
										code: true,
										colorCode: true,
										id: true,
										name: true,
									},
								},
							},
						},
					},
				},
			},
		});

		if (input.search) {
			const searchLower = input.search.toLowerCase();
			serviceList = serviceList.filter(
				(s) =>
					s.name.toLowerCase().includes(searchLower) ||
					s.code.toLowerCase().includes(searchLower),
			);
		}

		return serviceList;
	});

export const getService = AuthProcedure.meta({
	permissions: ["services:read"],
})
	.input(v.object({ id: v.number() }))
	.handler(async ({ input }) => {
		const service = await db.query.services.findFirst({
			where: eq(services.id, input.id),
			with: {
				category: {
					columns: {
						code: true,
						colorCode: true,
						id: true,
						name: true,
					},
				},
				serviceFacilities: {
					with: {
						facility: {
							columns: {
								code: true,
								id: true,
								isBed: true,
								name: true,
								quantity: true,
							},
							with: {
								category: {
									columns: {
										code: true,
										colorCode: true,
										id: true,
										name: true,
									},
								},
							},
						},
					},
				},
			},
		});

		if (!service) {
			throw new Error("Service not found");
		}

		return service;
	});

export const createService = AuthProcedure.meta({
	permissions: ["services:write"],
})
	.input(createServiceSchema)
	.handler(async ({ input }) => {
		const existing = await db.query.services.findFirst({
			where: eq(services.code, input.code),
		});

		if (existing) {
			throw new Error(`Service code "${input.code}" already exists`);
		}

		const { facilityIds, ...serviceData } = input;

		const [service] = await db.insert(services).values(serviceData).returning();

		if (facilityIds && facilityIds.length > 0) {
			await db.insert(serviceFacilities).values(
				facilityIds.map((facilityId) => ({
					facilityId,
					serviceId: service.id,
				})),
			);
		}

		return service;
	});

export const updateService = AuthProcedure.meta({
	permissions: ["services:write"],
})
	.input(updateServiceSchema)
	.handler(async ({ input }) => {
		const { id, facilityIds, ...updateData } = input;

		if (updateData.code) {
			const existing = await db.query.services.findFirst({
				where: eq(services.code, updateData.code),
			});

			if (existing && existing.id !== id) {
				throw new Error(`Service code "${updateData.code}" already exists`);
			}
		}

		const [updated] = await db
			.update(services)
			.set({ ...updateData, updatedAt: new Date() })
			.where(eq(services.id, id))
			.returning();

		if (!updated) {
			throw new Error("Service not found");
		}

		if (facilityIds !== undefined) {
			await db
				.delete(serviceFacilities)
				.where(eq(serviceFacilities.serviceId, id));

			if (facilityIds.length > 0) {
				await db.insert(serviceFacilities).values(
					facilityIds.map((facilityId) => ({
						facilityId,
						serviceId: id,
					})),
				);
			}
		}

		return updated;
	});

export const deleteService = AuthProcedure.meta({
	permissions: ["services:delete"],
})
	.input(v.object({ id: v.number() }))
	.handler(async ({ input }) => {
		const [_updated] = await db
			.update(services)
			.set({ isActive: false, updatedAt: new Date() })
			.where(eq(services.id, input.id))
			.returning();

		return {
			message: "Service deactivated successfully",
			success: true,
		};
	});
