import { relations } from "drizzle-orm";
import {
	boolean,
	integer,
	pgTable,
	serial,
	text,
	timestamp,
} from "drizzle-orm/pg-core";

import { branches } from "./branches";

export const doctors = pgTable("doctors", {
	additionalQualifications: text("additional_qualifications"),
	bio: text(),
	createdAt: timestamp("created_at").defaultNow(),
	defaultSlotDuration: integer("default_slot_duration").default(15),
	doctorId: text("doctor_id").notNull().unique(),
	email: text().notNull(),
	id: serial().primaryKey(),
	isActive: boolean("is_active").notNull().default(true),
	isVerified: boolean("is_verified").notNull().default(false),
	name: text().notNull(),
	phone: text(),
	photoKey: text("photo_key"),
	practicingSince: integer("practicing_since"),
	qualification: text().notNull(),
	registrationCouncil: text("registration_council"),
	registrationDate: timestamp("registration_date"),
	registrationNumber: text("registration_number").notNull(),
	updatedAt: timestamp("updated_at").defaultNow(),
});

export const specializations = pgTable("specializations", {
	code: text().unique(),
	createdAt: timestamp("created_at").defaultNow(),
	description: text(),
	id: serial().primaryKey(),
	isActive: boolean("is_active").notNull().default(true),
	name: text().notNull(),
	updatedAt: timestamp("updated_at").defaultNow(),
});

export const doctorSpecializations = pgTable("doctor_specializations", {
	certifications: text(),
	createdAt: timestamp("created_at").defaultNow(),
	doctorId: serial("doctor_id")
		.notNull()
		.references(() => doctors.id, { onDelete: "cascade" }),
	id: serial().primaryKey(),
	isPrimary: boolean("is_primary").notNull().default(false),
	specializationId: serial("specialization_id")
		.notNull()
		.references(() => specializations.id, { onDelete: "cascade" }),
});

export const doctorOpdAvailability = pgTable("doctor_opd_availability", {
	branchId: serial("branch_id")
		.notNull()
		.references(() => branches.id),
	createdAt: timestamp("created_at").defaultNow(),
	dayOfWeek: integer("day_of_week").notNull(),
	defaultSlotDuration: integer("default_slot_duration"),
	doctorId: serial("doctor_id")
		.notNull()
		.references(() => doctors.id, { onDelete: "cascade" }),
	effectiveFrom: timestamp("effective_from"),
	effectiveTo: timestamp("effective_to"),
	endTime: text("end_time").notNull(),
	id: serial().primaryKey(),
	isActive: boolean("is_active").notNull().default(true),
	maxAppointments: integer("max_appointments"),
	roomNumber: text("room_number"),
	slotDuration: integer("slot_duration").default(15),
	startTime: text("start_time").notNull(),
	updatedAt: timestamp("updated_at").defaultNow(),
});

export const doctorIpdAvailability = pgTable("doctor_ipd_availability", {
	branchId: serial("branch_id")
		.notNull()
		.references(() => branches.id),
	createdAt: timestamp("created_at").defaultNow(),
	dayOfWeek: integer("day_of_week").notNull(),
	doctorId: serial("doctor_id")
		.notNull()
		.references(() => doctors.id, { onDelete: "cascade" }),
	id: serial().primaryKey(),
	isActive: boolean("is_active").notNull().default(true),
	maxAdmissions: integer("max_admissions"),
	updatedAt: timestamp("updated_at").defaultNow(),
	visitEndTime: text("visit_end_time").notNull(),
	visitStartTime: text("visit_start_time").notNull(),
	wardRoundTime: text("ward_round_time"),
});

export const doctorDocuments = pgTable("doctor_documents", {
	createdAt: timestamp("created_at").defaultNow(),
	description: text("description"),
	doctorId: serial("doctor_id")
		.notNull()
		.references(() => doctors.id, { onDelete: "cascade" }),
	fileKey: text("file_key").notNull(),
	fileName: text("file_name").notNull(),
	fileSize: integer("file_size").notNull(),
	fileType: text("file_type").notNull(),
	id: serial().primaryKey(),
	title: text("title").notNull(),
});

export const doctorUnavailability = pgTable("doctor_unavailability", {
	affectsIpd: boolean("affects_ipd").notNull().default(true),
	affectsOpd: boolean("affects_opd").notNull().default(true),
	createdAt: timestamp("created_at").defaultNow(),
	doctorId: serial("doctor_id")
		.notNull()
		.references(() => doctors.id, { onDelete: "cascade" }),
	endDate: timestamp("end_date").notNull(),
	id: serial().primaryKey(),
	reason: text(),
	startDate: timestamp("start_date").notNull(),
	type: text().default("full_day"),
	updatedAt: timestamp("updated_at").defaultNow(),
});

export const doctorRelations = relations(doctors, ({ many }) => ({
	documents: many(doctorDocuments),
	ipdAvailability: many(doctorIpdAvailability),
	opdAvailability: many(doctorOpdAvailability),
	specializations: many(doctorSpecializations),
	unavailability: many(doctorUnavailability),
}));

export const specializationRelations = relations(
	specializations,
	({ many }) => ({
		doctors: many(doctorSpecializations),
	}),
);

export const doctorSpecializationRelations = relations(
	doctorSpecializations,
	({ one }) => ({
		doctor: one(doctors, {
			fields: [doctorSpecializations.doctorId],
			references: [doctors.id],
		}),
		specialization: one(specializations, {
			fields: [doctorSpecializations.specializationId],
			references: [specializations.id],
		}),
	}),
);

export const doctorOpdAvailabilityRelations = relations(
	doctorOpdAvailability,
	({ one }) => ({
		branch: one(branches, {
			fields: [doctorOpdAvailability.branchId],
			references: [branches.id],
		}),
		doctor: one(doctors, {
			fields: [doctorOpdAvailability.doctorId],
			references: [doctors.id],
		}),
	}),
);

export const doctorIpdAvailabilityRelations = relations(
	doctorIpdAvailability,
	({ one }) => ({
		branch: one(branches, {
			fields: [doctorIpdAvailability.branchId],
			references: [branches.id],
		}),
		doctor: one(doctors, {
			fields: [doctorIpdAvailability.doctorId],
			references: [doctors.id],
		}),
	}),
);

export const doctorDocumentRelations = relations(
	doctorDocuments,
	({ one }) => ({
		doctor: one(doctors, {
			fields: [doctorDocuments.doctorId],
			references: [doctors.id],
		}),
	}),
);

export const doctorUnavailabilityRelations = relations(
	doctorUnavailability,
	({ one }) => ({
		doctor: one(doctors, {
			fields: [doctorUnavailability.doctorId],
			references: [doctors.id],
		}),
	}),
);
