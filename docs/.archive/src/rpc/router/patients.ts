import { eq, sql } from "drizzle-orm";
import * as v from "valibot";

import { db } from "#/lib/db/server";
import { createStorageModule } from "#/lib/storage";
import { AuthProcedure } from "#/rpc/procedure";
import { patients } from "#/schemas/db";

const storage = createStorageModule();

const emergencyContactSchema = v.object({
	name: v.string(),
	phone: v.string(),
	relation: v.string(),
});

const identifierSchema = v.object({
	system: v.optional(v.string()),
	type: v.string(),
	value: v.string(),
});

const createPatientSchema = v.object({
	active: v.optional(v.boolean(), true),
	addressLine1: v.optional(v.string()),
	addressLine2: v.optional(v.string()),
	allergies: v.optional(v.string()),
	birthDate: v.optional(v.string()),
	bloodGroup: v.optional(
		v.union([
			v.picklist(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "unknown"]),
			v.literal(""),
		]),
	),
	city: v.optional(v.string()),
	country: v.optional(v.string(), "India"),
	email: v.optional(
		v.union([
			v.pipe(v.string(), v.email("Invalid email format")),
			v.literal(""),
		]),
	),
	emergencyContacts: v.optional(v.array(emergencyContactSchema)),
	gender: v.optional(v.picklist(["male", "female", "other", "unknown"])),
	identifiers: v.optional(v.array(identifierSchema)),
	insurancePolicyNumber: v.optional(v.string()),
	insuranceProvider: v.optional(v.string()),
	maritalStatus: v.optional(
		v.union([
			v.picklist(["single", "married", "divorced", "widowed", "unknown"]),
			v.literal(""),
		]),
	),
	name: v.pipe(v.string(), v.nonEmpty("Patient name is required")),
	nationality: v.optional(v.string(), "Indian"),
	occupation: v.optional(v.string()),
	phone: v.optional(v.string()),
	phoneAlt: v.optional(v.string()),
	photoUrl: v.optional(v.string()),
	pincode: v.optional(
		v.union([
			v.pipe(v.string(), v.regex(/^[1-9][0-9]{5}$/, "Invalid pincode")),
			v.literal(""),
		]),
	),
	state: v.optional(v.string()),
});

async function generateMrn(): Promise<string> {
	const year = new Date().getFullYear();
	const result = await db
		.select({ count: sql<number>`count(*)` })
		.from(patients)
		.where(sql`mrn like 'MRN-${year}-%'`);

	const count = result[0]?.count ?? 0;
	const sequence = String(count + 1).padStart(5, "0");
	return `MRN-${year}-${sequence}`;
}

export const createPatient = AuthProcedure.meta({
	permissions: ["patients:write"],
})
	.input(createPatientSchema)
	.handler(async ({ input }) => {
		const mrn = await generateMrn();

		const cleanData = Object.fromEntries(
			Object.entries(input).filter(
				([_, val]) => val !== "" && val !== undefined,
			),
		);

		const [patient] = await db
			.insert(patients)
			.values({
				...cleanData,
				mrn,
			} as typeof patients.$inferInsert)
			.returning();

		return patient;
	});

export const getPatient = AuthProcedure.meta({
	permissions: ["patients:read"],
})
	.input(v.object({ id: v.number() }))
	.handler(async ({ input }) => {
		const patient = await db.query.patients.findFirst({
			where: eq(patients.id, input.id),
		});
		if (!patient) {
			throw new Error("Patient not found");
		}
		return patient;
	});

export const listPatients = AuthProcedure.meta({
	permissions: ["patients:read"],
})
	.input(
		v.object({
			activeOnly: v.optional(v.boolean()),
			limit: v.optional(v.number(), 50),
			offset: v.optional(v.number(), 0),
			search: v.optional(v.string()),
		}),
	)
	.handler(async ({ input }) => {
		const result = await db.query.patients.findMany({
			limit: input.limit,
			offset: input.offset,
			orderBy: (patients, { desc }) => [desc(patients.createdAt)],
			where: (patients, { and, eq, or, ilike }) => {
				const conditions = [];

				if (input.activeOnly) {
					conditions.push(eq(patients.active, true));
				}

				if (input.search) {
					conditions.push(
						or(
							ilike(patients.name, `%${input.search}%`),
							ilike(patients.mrn, `%${input.search}%`),
							ilike(patients.phone, `%${input.search}%`),
						),
					);
				}

				return conditions.length > 0 ? and(...conditions) : undefined;
			},
		});
		return result;
	});

const updatePatientSchema = v.intersect([
	createPatientSchema,
	v.object({ id: v.number() }),
]);

export const updatePatient = AuthProcedure.meta({
	permissions: ["patients:write"],
})
	.input(updatePatientSchema)
	.handler(async ({ input }) => {
		const { id, ...data } = input;
		const [updated] = await db
			.update(patients)
			.set({
				...data,
				updatedAt: new Date(),
			})
			.where(eq(patients.id, id))
			.returning();
		return updated;
	});

export const deletePatient = AuthProcedure.meta({
	permissions: ["patients:delete"],
})
	.input(v.object({ id: v.number() }))
	.handler(async ({ input }) => {
		const [deleted] = await db
			.update(patients)
			.set({ active: false, updatedAt: new Date() })
			.where(eq(patients.id, input.id))
			.returning();
		return deleted;
	});

export const getPresignedPatientPhotoUrl = AuthProcedure.meta({
	permissions: ["patients:write"],
})
	.input(
		v.object({
			contentType: v.optional(v.string(), "image/jpeg"),
			patientId: v.string(),
		}),
	)
	.handler(async ({ input }) => {
		return storage.upload({
			category: "photo",
			contentType: input.contentType,
			fileName: `photo-${input.patientId}.jpg`,
			ownerId: input.patientId,
			ownerType: "patient",
		});
	});
