import { and, eq } from "drizzle-orm";
import * as v from "valibot";

import { db } from "#/lib/db/server";
import { createStorageModule } from "#/lib/storage";
import { AuthProcedure } from "#/rpc/procedure";
import {
	bankAccounts,
	doctorDocuments,
	doctorIpdAvailability,
	doctorOpdAvailability,
	doctorSpecializations,
	doctors,
	doctorUnavailability,
} from "#/schemas/db";

const storage = createStorageModule();

const createDoctorSchema = v.object({
	additionalQualifications: v.optional(v.string()),
	bio: v.optional(v.string()),
	defaultSlotDuration: v.optional(v.number(), 15),
	doctorId: v.pipe(v.string(), v.nonEmpty("Doctor ID is required")),
	email: v.pipe(v.string(), v.email("Valid email is required")),
	name: v.pipe(v.string(), v.nonEmpty("Name is required")),
	phone: v.optional(v.string()),
	photoKey: v.optional(v.string()),
	practicingSince: v.optional(
		v.pipe(v.number(), v.minValue(1900), v.maxValue(new Date().getFullYear())),
	),
	qualification: v.pipe(v.string(), v.nonEmpty("Qualification is required")),
	registrationCouncil: v.optional(v.string()),
	registrationDate: v.optional(v.pipe(v.string(), v.isoDateTime())),
	registrationNumber: v.pipe(
		v.string(),
		v.nonEmpty("Registration number is required"),
	),
	specializationIds: v.optional(
		v.array(
			v.object({
				isPrimary: v.optional(v.boolean(), false),
				specializationId: v.number(),
			}),
		),
	),
});

const updateDoctorSchema = v.object({
	additionalQualifications: v.optional(v.string()),
	bio: v.optional(v.string()),
	defaultSlotDuration: v.optional(v.number()),
	id: v.number(),
	isActive: v.optional(v.boolean()),
	isVerified: v.optional(v.boolean()),
	name: v.optional(v.string()),
	phone: v.optional(v.string()),
	photoKey: v.optional(v.string()),
	practicingSince: v.optional(
		v.pipe(v.number(), v.minValue(1900), v.maxValue(new Date().getFullYear())),
	),
	qualification: v.optional(v.string()),
	registrationCouncil: v.optional(v.string()),
	registrationDate: v.optional(v.pipe(v.string(), v.isoDateTime())),
	registrationNumber: v.optional(v.string()),
});

const listDoctorsSchema = v.object({
	isActive: v.optional(v.boolean()),
	isVerified: v.optional(v.boolean()),
	search: v.optional(v.string()),
	specializationId: v.optional(v.number()),
});

const createOpdScheduleSchema = v.object({
	branchId: v.number(),
	dayOfWeek: v.pipe(v.number(), v.minValue(0), v.maxValue(6)),
	defaultSlotDuration: v.optional(v.number()),
	doctorId: v.number(),
	effectiveFrom: v.optional(v.pipe(v.string(), v.isoDateTime())),
	effectiveTo: v.optional(v.pipe(v.string(), v.isoDateTime())),
	endTime: v.pipe(v.string(), v.regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)),
	isActive: v.optional(v.boolean(), true),
	maxAppointments: v.optional(v.number()),
	roomNumber: v.optional(v.string()),
	slotDuration: v.optional(v.number(), 15),
	startTime: v.pipe(v.string(), v.regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)),
});

const updateOpdScheduleSchema = v.object({
	branchId: v.optional(v.number()),
	dayOfWeek: v.optional(v.pipe(v.number(), v.minValue(0), v.maxValue(6))),
	defaultSlotDuration: v.optional(v.number()),
	effectiveFrom: v.optional(v.pipe(v.string(), v.isoDateTime())),
	effectiveTo: v.optional(v.pipe(v.string(), v.isoDateTime())),
	endTime: v.optional(
		v.pipe(v.string(), v.regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)),
	),
	id: v.number(),
	isActive: v.optional(v.boolean()),
	maxAppointments: v.optional(v.number()),
	roomNumber: v.optional(v.string()),
	slotDuration: v.optional(v.number()),
	startTime: v.optional(
		v.pipe(v.string(), v.regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)),
	),
});

const createIpdScheduleSchema = v.object({
	branchId: v.number(),
	dayOfWeek: v.pipe(v.number(), v.minValue(0), v.maxValue(6)),
	doctorId: v.number(),
	isActive: v.optional(v.boolean(), true),
	maxAdmissions: v.optional(v.number()),
	visitEndTime: v.pipe(
		v.string(),
		v.regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
	),
	visitStartTime: v.pipe(
		v.string(),
		v.regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
	),
	wardRoundTime: v.optional(v.string()),
});

const updateIpdScheduleSchema = v.object({
	branchId: v.optional(v.number()),
	dayOfWeek: v.optional(v.pipe(v.number(), v.minValue(0), v.maxValue(6))),
	id: v.number(),
	isActive: v.optional(v.boolean()),
	maxAdmissions: v.optional(v.number()),
	visitEndTime: v.optional(
		v.pipe(v.string(), v.regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)),
	),
	visitStartTime: v.optional(
		v.pipe(v.string(), v.regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)),
	),
	wardRoundTime: v.optional(v.string()),
});

const createUnavailabilitySchema = v.object({
	affectsIpd: v.optional(v.boolean(), true),
	affectsOpd: v.optional(v.boolean(), true),
	doctorId: v.number(),
	endDate: v.pipe(v.string(), v.isoDateTime()),
	reason: v.optional(v.string()),
	startDate: v.pipe(v.string(), v.isoDateTime()),
	type: v.optional(v.picklist(["full_day", "partial"]), "full_day"),
});

export interface DoctorWithSpecializations {
	additionalQualifications: string | null;
	bio: string | null;
	createdAt: Date;
	defaultSlotDuration: number | null;
	doctorId: string;
	email: string;
	id: number;
	isActive: boolean;
	isVerified: boolean;
	name: string;
	phone: string | null;
	photoKey: string | null;
	practicingSince: number | null;
	qualification: string;
	registrationCouncil: string | null;
	registrationDate: Date | null;
	registrationNumber: string;
	specializations: Array<{
		id: number;
		specializationId: number;
		isPrimary: boolean;
		certifications: string | null;
		specialization: {
			id: number;
			name: string;
			code: string | null;
		};
	}>;
	updatedAt: Date;
}

export interface OpdScheduleWithBranch {
	branch: {
		id: number;
		name: string;
		branchCode: string;
	};
	branchId: number;
	dayOfWeek: number;
	doctorId: number;
	effectiveFrom: Date | null;
	effectiveTo: Date | null;
	endTime: string;
	id: number;
	isActive: boolean;
	maxAppointments: number | null;
	roomNumber: string | null;
	slotDuration: number | null;
	startTime: string;
}

export interface IpdScheduleWithBranch {
	branch: {
		id: number;
		name: string;
		branchCode: string;
	};
	branchId: number;
	dayOfWeek: number;
	doctorId: number;
	id: number;
	isActive: boolean;
	maxAdmissions: number | null;
	visitEndTime: string;
	visitStartTime: string;
	wardRoundTime: string | null;
}

export const listDoctors = AuthProcedure.meta({
	permissions: ["practitioners:read"],
})
	.input(listDoctorsSchema)
	.handler(async ({ input }) => {
		const conditions = [];

		if (input.isActive !== undefined) {
			conditions.push(eq(doctors.isActive, input.isActive));
		}
		if (input.isVerified !== undefined) {
			conditions.push(eq(doctors.isVerified, input.isVerified));
		}

		let doctorList = await db.query.doctors.findMany({
			orderBy: (doctors, { desc }) => [desc(doctors.createdAt)],
			where: conditions.length > 0 ? and(...conditions) : undefined,
			with: {
				specializations: {
					columns: {
						certifications: true,
						id: true,
						isPrimary: true,
						specializationId: true,
					},
					with: {
						specialization: {
							columns: {
								code: true,
								id: true,
								name: true,
							},
						},
					},
				},
			},
		});

		if (input.specializationId) {
			doctorList = doctorList.filter((doc) =>
				doc.specializations.some(
					(s) => s.specializationId === input.specializationId,
				),
			);
		}

		if (input.search) {
			const searchLower = input.search.toLowerCase();
			doctorList = doctorList.filter(
				(doc) =>
					doc.name.toLowerCase().includes(searchLower) ||
					doc.doctorId.toLowerCase().includes(searchLower) ||
					doc.registrationNumber.toLowerCase().includes(searchLower),
			);
		}

		return doctorList as DoctorWithSpecializations[];
	});

export const getDoctor = AuthProcedure.meta({
	permissions: ["practitioners:read"],
})
	.input(v.object({ id: v.number() }))
	.handler(async ({ input }) => {
		const doctor = await db.query.doctors.findFirst({
			where: eq(doctors.id, input.id),
			with: {
				documents: true,
				ipdAvailability: {
					with: {
						branch: {
							columns: {
								branchCode: true,
								id: true,
								name: true,
							},
						},
					},
				},
				opdAvailability: {
					with: {
						branch: {
							columns: {
								branchCode: true,
								id: true,
								name: true,
							},
						},
					},
				},
				specializations: {
					with: {
						specialization: {
							columns: {
								code: true,
								id: true,
								name: true,
							},
						},
					},
				},
				unavailability: true,
			},
		});

		if (!doctor) {
			throw new Error("Doctor not found");
		}

		const doctorBankAccounts = await db.query.bankAccounts.findMany({
			orderBy: (bankAccounts, { desc }) => [
				desc(bankAccounts.isDefault),
				desc(bankAccounts.createdAt),
			],
			where: and(
				eq(bankAccounts.ownerType, "practitioner"),
				eq(bankAccounts.ownerId, doctor.id),
			),
		});

		return { ...doctor, bankAccounts: doctorBankAccounts };
	});

export const createDoctor = AuthProcedure.meta({
	permissions: ["practitioners:write"],
})
	.input(createDoctorSchema)
	.handler(async ({ input }) => {
		const { specializationIds, ...doctorData } = input;

		const existingDoctor = await db.query.doctors.findFirst({
			where: eq(doctors.doctorId, input.doctorId),
		});

		if (existingDoctor) {
			throw new Error(`Doctor ID "${input.doctorId}" already exists`);
		}

		const existingRegNumber = await db.query.doctors.findFirst({
			where: eq(doctors.registrationNumber, input.registrationNumber),
		});

		if (existingRegNumber) {
			throw new Error(
				`Registration number "${input.registrationNumber}" already exists`,
			);
		}

		const [doctor] = await db
			.insert(doctors)
			.values({
				...doctorData,
				registrationDate: doctorData.registrationDate
					? new Date(doctorData.registrationDate)
					: null,
			})
			.returning();

		if (specializationIds && specializationIds.length > 0) {
			await db.insert(doctorSpecializations).values(
				specializationIds.map((s) => ({
					doctorId: doctor.id,
					isPrimary: s.isPrimary,
					specializationId: s.specializationId,
				})),
			);
		}

		return doctor;
	});

export const updateDoctor = AuthProcedure.meta({
	permissions: ["practitioners:write"],
})
	.input(updateDoctorSchema)
	.handler(async ({ input }) => {
		const { id, ...updateData } = input;

		const [updated] = await db
			.update(doctors)
			.set({
				...updateData,
				registrationDate: updateData.registrationDate
					? new Date(updateData.registrationDate)
					: undefined,
				updatedAt: new Date(),
			})
			.where(eq(doctors.id, id))
			.returning();

		if (!updated) {
			throw new Error("Doctor not found");
		}

		return updated;
	});

export const deleteDoctor = AuthProcedure.meta({
	permissions: ["practitioners:delete"],
})
	.input(v.object({ id: v.number() }))
	.handler(async ({ input }) => {
		const doctor = await db.query.doctors.findFirst({
			where: eq(doctors.id, input.id),
		});

		if (!doctor) {
			throw new Error("Doctor not found");
		}

		const [_updated] = await db
			.update(doctors)
			.set({
				isActive: false,
				updatedAt: new Date(),
			})
			.where(eq(doctors.id, input.id))
			.returning();

		if (doctor.photoKey) {
			await storage.remove(doctor.photoKey);
		}

		return { message: "Doctor deactivated successfully", success: true };
	});

export const updateDoctorSpecializations = AuthProcedure.meta({
	permissions: ["practitioners:write"],
})
	.input(
		v.object({
			doctorId: v.number(),
			specializations: v.array(
				v.object({
					isPrimary: v.optional(v.boolean(), false),
					specializationId: v.number(),
				}),
			),
		}),
	)
	.handler(async ({ input }) => {
		await db
			.delete(doctorSpecializations)
			.where(eq(doctorSpecializations.doctorId, input.doctorId));

		if (input.specializations.length > 0) {
			await db.insert(doctorSpecializations).values(
				input.specializations.map((s) => ({
					doctorId: input.doctorId,
					isPrimary: s.isPrimary,
					specializationId: s.specializationId,
				})),
			);
		}

		return { success: true };
	});

export const getPresignedDoctorPhotoUrl = AuthProcedure.meta({
	permissions: ["practitioners:write"],
})
	.input(
		v.object({
			contentType: v.optional(v.string(), "image/jpeg"),
			doctorId: v.string(),
		}),
	)
	.handler(async ({ input }) => {
		return storage.upload({
			category: "photo",
			contentType: input.contentType,
			fileName: `photo-${input.doctorId}.jpg`,
			ownerId: input.doctorId,
			ownerType: "practitioner",
		});
	});

export const listOpdAvailability = AuthProcedure.meta({
	permissions: ["practitioners:read"],
})
	.input(v.object({ doctorId: v.number() }))
	.handler(async ({ input }) => {
		const availability = await db.query.doctorOpdAvailability.findMany({
			orderBy: (doctorOpdAvailability, { asc }) => [
				asc(doctorOpdAvailability.dayOfWeek),
			],
			where: eq(doctorOpdAvailability.doctorId, input.doctorId),
			with: {
				branch: {
					columns: {
						branchCode: true,
						id: true,
						name: true,
					},
				},
			},
		});

		return availability as OpdScheduleWithBranch[];
	});

export const createOpdSchedule = AuthProcedure.meta({
	permissions: ["practitioners:write"],
})
	.input(createOpdScheduleSchema)
	.handler(async ({ input }) => {
		const [schedule] = await db
			.insert(doctorOpdAvailability)
			.values({
				...input,
				effectiveFrom: input.effectiveFrom
					? new Date(input.effectiveFrom)
					: null,
				effectiveTo: input.effectiveTo ? new Date(input.effectiveTo) : null,
			})
			.returning();
		return schedule;
	});

export const updateOpdSchedule = AuthProcedure.meta({
	permissions: ["practitioners:write"],
})
	.input(updateOpdScheduleSchema)
	.handler(async ({ input }) => {
		const { id, effectiveFrom, effectiveTo, ...updateData } = input;

		const [updated] = await db
			.update(doctorOpdAvailability)
			.set({
				...updateData,
				effectiveFrom: effectiveFrom ? new Date(effectiveFrom) : undefined,
				effectiveTo: effectiveTo ? new Date(effectiveTo) : undefined,
				updatedAt: new Date(),
			})
			.where(eq(doctorOpdAvailability.id, id))
			.returning();

		if (!updated) {
			throw new Error("OPD schedule not found");
		}

		return updated;
	});

export const deleteOpdSchedule = AuthProcedure.meta({
	permissions: ["practitioners:delete"],
})
	.input(v.object({ id: v.number() }))
	.handler(async ({ input }) => {
		await db
			.delete(doctorOpdAvailability)
			.where(eq(doctorOpdAvailability.id, input.id));
		return { success: true };
	});

export const getAvailableSlots = AuthProcedure.meta({
	permissions: ["practitioners:read"],
})
	.input(
		v.object({
			branchId: v.optional(v.number()),
			date: v.string(),
			doctorId: v.number(),
		}),
	)
	.handler(async ({ input }) => {
		const date = new Date(input.date);
		const dayOfWeek = date.getDay();

		const availability = await db.query.doctorOpdAvailability.findMany({
			where: and(
				eq(doctorOpdAvailability.doctorId, input.doctorId),
				eq(doctorOpdAvailability.dayOfWeek, dayOfWeek),
				eq(doctorOpdAvailability.isActive, true),
				input.branchId
					? eq(doctorOpdAvailability.branchId, input.branchId)
					: undefined,
			),
		});

		const unavailabilityRecords = await db.query.doctorUnavailability.findMany({
			where: and(
				eq(doctorUnavailability.doctorId, input.doctorId),
				eq(doctorUnavailability.affectsOpd, true),
			),
		});

		const isBlocked = unavailabilityRecords.some((u) => {
			const start = new Date(u.startDate);
			const end = new Date(u.endDate);
			return date >= start && date <= end;
		});

		if (isBlocked) {
			return [];
		}

		const schedules = availability.map((s) => ({
			dayOfWeek,
			endTime: s.endTime,
			maxAppointments: s.maxAppointments ?? 1,
			resourceId: String(input.doctorId),
			startTime: s.startTime,
		}));

		const unavailability = unavailabilityRecords
			.filter((u) => {
				const start = new Date(u.startDate);
				const end = new Date(u.endDate);
				return date >= start && date <= end;
			})
			.map(() => ({
				date: input.date,
				endTime: "23:59",
				resourceId: String(input.doctorId),
				startTime: "00:00",
			}));

		const slotDuration = availability[0]?.slotDuration || 15;

		const { generateAvailableSlots } = await import("#/scheduler");

		const slots = generateAvailableSlots({
			date: input.date,
			schedules,
			slotDuration,
			unavailability,
		});

		return slots.map((slot) => {
			const schedule = availability.find(
				(s) => s.startTime <= slot.startTime && s.endTime >= slot.endTime,
			);
			return {
				...slot,
				maxAppointments: schedule?.maxAppointments ?? null,
				roomNumber: schedule?.roomNumber ?? null,
				slotDuration,
			};
		});
	});

export const listIpdAvailability = AuthProcedure.meta({
	permissions: ["practitioners:read"],
})
	.input(v.object({ doctorId: v.number() }))
	.handler(async ({ input }) => {
		const availability = await db.query.doctorIpdAvailability.findMany({
			orderBy: (doctorIpdAvailability, { asc }) => [
				asc(doctorIpdAvailability.dayOfWeek),
			],
			where: eq(doctorIpdAvailability.doctorId, input.doctorId),
			with: {
				branch: {
					columns: {
						branchCode: true,
						id: true,
						name: true,
					},
				},
			},
		});

		return availability as IpdScheduleWithBranch[];
	});

export const createIpdSchedule = AuthProcedure.meta({
	permissions: ["practitioners:write"],
})
	.input(createIpdScheduleSchema)
	.handler(async ({ input }) => {
		const [schedule] = await db
			.insert(doctorIpdAvailability)
			.values(input)
			.returning();
		return schedule;
	});

export const updateIpdSchedule = AuthProcedure.meta({
	permissions: ["practitioners:write"],
})
	.input(updateIpdScheduleSchema)
	.handler(async ({ input }) => {
		const { id, ...updateData } = input;

		const [updated] = await db
			.update(doctorIpdAvailability)
			.set({
				...updateData,
				updatedAt: new Date(),
			})
			.where(eq(doctorIpdAvailability.id, id))
			.returning();

		if (!updated) {
			throw new Error("IPD schedule not found");
		}

		return updated;
	});

export const deleteIpdSchedule = AuthProcedure.meta({
	permissions: ["practitioners:delete"],
})
	.input(v.object({ id: v.number() }))
	.handler(async ({ input }) => {
		await db
			.delete(doctorIpdAvailability)
			.where(eq(doctorIpdAvailability.id, input.id));
		return { success: true };
	});

export const listUnavailability = AuthProcedure.meta({
	permissions: ["practitioners:read"],
})
	.input(
		v.object({
			doctorId: v.number(),
			endDate: v.optional(v.string()),
			startDate: v.optional(v.string()),
		}),
	)
	.handler(async ({ input }) => {
		const conditions = [eq(doctorUnavailability.doctorId, input.doctorId)];

		if (input.startDate) {
			conditions.push(
				eq(doctorUnavailability.startDate, new Date(input.startDate)),
			);
		}

		const unavailability = await db.query.doctorUnavailability.findMany({
			orderBy: (doctorUnavailability, { desc }) => [
				desc(doctorUnavailability.startDate),
			],
			where: and(...conditions),
		});

		return unavailability;
	});

export const createUnavailability = AuthProcedure.meta({
	permissions: ["practitioners:write"],
})
	.input(createUnavailabilitySchema)
	.handler(async ({ input }) => {
		const [unavailability] = await db
			.insert(doctorUnavailability)
			.values({
				...input,
				endDate: new Date(input.endDate),
				startDate: new Date(input.startDate),
			})
			.returning();

		return unavailability;
	});

export const deleteUnavailability = AuthProcedure.meta({
	permissions: ["practitioners:delete"],
})
	.input(v.object({ id: v.number() }))
	.handler(async ({ input }) => {
		await db
			.delete(doctorUnavailability)
			.where(eq(doctorUnavailability.id, input.id));
		return { success: true };
	});

export const getPresignedDoctorDocumentUrl = AuthProcedure.meta({
	permissions: ["practitioners:write"],
})
	.input(
		v.object({
			contentType: v.string(),
			doctorId: v.string(),
			fileName: v.string(),
		}),
	)
	.handler(async ({ input }) => {
		return storage.upload({
			category: "document",
			contentType: input.contentType,
			fileName: input.fileName,
			ownerId: input.doctorId,
			ownerType: "practitioner",
		});
	});

export const createDoctorDocument = AuthProcedure.meta({
	permissions: ["practitioners:write"],
})
	.input(
		v.object({
			description: v.optional(v.string()),
			doctorId: v.number(),
			fileKey: v.string(),
			fileName: v.string(),
			fileSize: v.number(),
			fileType: v.string(),
			title: v.pipe(v.string(), v.nonEmpty("Title is required")),
		}),
	)
	.handler(async ({ input }) => {
		const [document] = await db
			.insert(doctorDocuments)
			.values(input)
			.returning();
		return document;
	});

export const listDoctorDocuments = AuthProcedure.meta({
	permissions: ["practitioners:read"],
})
	.input(v.object({ doctorId: v.number() }))
	.handler(async ({ input }) => {
		const documents = await db.query.doctorDocuments.findMany({
			orderBy: (doctorDocuments, { desc }) => [desc(doctorDocuments.createdAt)],
			where: eq(doctorDocuments.doctorId, input.doctorId),
		});
		return documents;
	});

export const deleteDoctorDocument = AuthProcedure.meta({
	permissions: ["practitioners:delete"],
})
	.input(v.object({ id: v.number() }))
	.handler(async ({ input }) => {
		const document = await db.query.doctorDocuments.findFirst({
			where: eq(doctorDocuments.id, input.id),
		});

		if (!document) {
			throw new Error("Document not found");
		}

		await storage.remove(document.fileKey);

		await db.delete(doctorDocuments).where(eq(doctorDocuments.id, input.id));
		return { success: true };
	});

export const checkDoctorIdUniqueness = AuthProcedure.meta({
	permissions: ["practitioners:read"],
})
	.input(v.object({ doctorId: v.string() }))
	.handler(async ({ input }) => {
		const existing = await db.query.doctors.findFirst({
			where: eq(doctors.doctorId, input.doctorId),
		});
		return { isUnique: !existing };
	});

export const checkEmailUniqueness = AuthProcedure.meta({
	permissions: ["practitioners:read"],
})
	.input(v.object({ email: v.string() }))
	.handler(async ({ input }) => {
		const existing = await db.query.doctors.findFirst({
			where: eq(doctors.email, input.email),
		});
		return { isUnique: !existing };
	});

export const checkRegistrationNumberUniqueness = AuthProcedure.meta({
	permissions: ["practitioners:read"],
})
	.input(v.object({ registrationNumber: v.string() }))
	.handler(async ({ input }) => {
		const existing = await db.query.doctors.findFirst({
			where: eq(doctors.registrationNumber, input.registrationNumber),
		});
		return { isUnique: !existing };
	});
