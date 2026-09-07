import { eq } from "drizzle-orm";
import * as v from "valibot";

import { db } from "#/lib/db/server";
import { AuthProcedure } from "#/rpc/procedure";
import { vendors } from "#/schemas/db";

const identifierSchema = v.object({
	system: v.string(),
	type: v.string(),
	value: v.string(),
});

const createVendorSchema = v.object({
	accountHolderName: v.optional(v.string()),
	accountNumber: v.optional(v.string()),
	active: v.optional(v.boolean(), true),
	addressLine1: v.optional(v.string()),
	addressLine2: v.optional(v.string()),
	bankBranch: v.optional(v.string()),
	bankName: v.optional(v.string()),
	cin: v.optional(v.string()),
	city: v.optional(v.string()),
	country: v.optional(v.string(), "India"),
	email: v.optional(v.string()),
	gstn: v.optional(v.string()),
	identifiers: v.optional(v.array(identifierSchema)),
	iec: v.optional(v.string()),
	ifscCode: v.optional(v.string()),
	name: v.pipe(v.string(), v.nonEmpty("Vendor name is required")),
	organizationType: v.optional(v.string()),
	pan: v.optional(v.string()),
	phone: v.optional(v.string()),
	pincode: v.optional(v.string()),
	state: v.optional(v.string()),
	tan: v.optional(v.string()),
	udyamRegistration: v.optional(v.string()),
	vendorType: v.optional(v.string()),
	website: v.optional(v.string()),
});

export const createVendor = AuthProcedure.meta({
	permissions: ["vendors:write"],
})
	.input(createVendorSchema)
	.handler(async ({ input }) => {
		const [vendor] = await db.insert(vendors).values(input).returning();
		return vendor;
	});

export const getVendor = AuthProcedure.meta({
	permissions: ["vendors:read"],
})
	.input(v.object({ id: v.number() }))
	.handler(async ({ input }) => {
		const vendor = await db.query.vendors.findFirst({
			where: eq(vendors.id, input.id),
		});
		if (!vendor) {
			throw new Error("Vendor not found");
		}
		return vendor;
	});

export const listVendors = AuthProcedure.meta({
	permissions: ["vendors:read"],
})
	.input(
		v.object({
			activeOnly: v.optional(v.boolean()),
		}),
	)
	.handler(async ({ input }) => {
		const result = await db.query.vendors.findMany({
			where: input.activeOnly ? eq(vendors.active, true) : undefined,
		});
		return result;
	});

const updateVendorSchema = v.intersect([
	createVendorSchema,
	v.object({ id: v.number() }),
]);

export const updateVendor = AuthProcedure.meta({
	permissions: ["vendors:write"],
})
	.input(updateVendorSchema)
	.handler(async ({ input }) => {
		const { id, ...data } = input;
		const [updated] = await db
			.update(vendors)
			.set({
				...data,
				updatedAt: new Date(),
			})
			.where(eq(vendors.id, id))
			.returning();
		return updated;
	});

export const deleteVendor = AuthProcedure.meta({
	permissions: ["vendors:delete"],
})
	.input(v.object({ id: v.number() }))
	.handler(async ({ input }) => {
		const [deleted] = await db
			.update(vendors)
			.set({ active: false, updatedAt: new Date() })
			.where(eq(vendors.id, input.id))
			.returning();
		return deleted;
	});
