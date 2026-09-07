import { relations } from "drizzle-orm";
import {
	boolean,
	integer,
	pgTable,
	serial,
	text,
	timestamp,
} from "drizzle-orm/pg-core";

export const facilityCategories = pgTable("facility_categories", {
	code: text().notNull().unique(),
	colorCode: text("color_code").notNull().default("#6b7280"),
	createdAt: timestamp("created_at").defaultNow(),
	description: text(),
	id: serial().primaryKey(),
	isActive: boolean("is_active").notNull().default(true),
	name: text().notNull(),
	updatedAt: timestamp("updated_at").defaultNow(),
});

export const facilities = pgTable("facilities", {
	categoryId: serial("category_id")
		.notNull()
		.references(() => facilityCategories.id),
	code: text().notNull().unique(),
	createdAt: timestamp("created_at").defaultNow(),
	description: text(),
	id: serial().primaryKey(),
	isActive: boolean("is_active").notNull().default(true),
	isBed: boolean("is_bed").notNull().default(false),
	name: text().notNull(),
	quantity: integer().notNull().default(1),
	updatedAt: timestamp("updated_at").defaultNow(),
});

export const facilitySchedules = pgTable("facility_schedules", {
	createdAt: timestamp("created_at").defaultNow(),
	dayOfWeek: integer("day_of_week").notNull(),
	endTime: text("end_time").notNull(),
	facilityId: serial("facility_id")
		.notNull()
		.references(() => facilities.id, { onDelete: "cascade" }),
	id: serial().primaryKey(),
	isActive: boolean("is_active").notNull().default(true),
	startTime: text("start_time").notNull(),
	updatedAt: timestamp("updated_at").defaultNow(),
});

export const services = pgTable("services", {
	categoryId: serial("category_id")
		.notNull()
		.references(() => facilityCategories.id),
	code: text().notNull().unique(),
	cost: integer().notNull(),
	createdAt: timestamp("created_at").defaultNow(),
	description: text(),
	duration: integer(),
	id: serial().primaryKey(),
	isActive: boolean("is_active").notNull().default(true),
	name: text().notNull(),
	updatedAt: timestamp("updated_at").defaultNow(),
});

export const serviceFacilities = pgTable("service_facilities", {
	createdAt: timestamp("created_at").defaultNow(),
	facilityId: serial("facility_id")
		.notNull()
		.references(() => facilities.id, { onDelete: "cascade" }),
	id: serial().primaryKey(),
	serviceId: serial("service_id")
		.notNull()
		.references(() => services.id, { onDelete: "cascade" }),
});

export const facilityCategoryRelations = relations(
	facilityCategories,
	({ many }) => ({
		facilities: many(facilities),
		services: many(services),
	}),
);

export const facilityRelations = relations(facilities, ({ many, one }) => ({
	category: one(facilityCategories, {
		fields: [facilities.categoryId],
		references: [facilityCategories.id],
	}),
	schedules: many(facilitySchedules),
	serviceFacilities: many(serviceFacilities),
}));

export const facilityScheduleRelations = relations(
	facilitySchedules,
	({ one }) => ({
		facility: one(facilities, {
			fields: [facilitySchedules.facilityId],
			references: [facilities.id],
		}),
	}),
);

export const serviceRelations = relations(services, ({ many, one }) => ({
	category: one(facilityCategories, {
		fields: [services.categoryId],
		references: [facilityCategories.id],
	}),
	serviceFacilities: many(serviceFacilities),
}));

export const serviceFacilityRelations = relations(
	serviceFacilities,
	({ one }) => ({
		facility: one(facilities, {
			fields: [serviceFacilities.facilityId],
			references: [facilities.id],
		}),
		service: one(services, {
			fields: [serviceFacilities.serviceId],
			references: [services.id],
		}),
	}),
);

export type FacilityCategory = typeof facilityCategories.$inferSelect;
export type NewFacilityCategory = typeof facilityCategories.$inferInsert;
export type Facility = typeof facilities.$inferSelect;
export type NewFacility = typeof facilities.$inferInsert;
export type Service = typeof services.$inferSelect;
export type NewService = typeof services.$inferInsert;
