import { relations } from "drizzle-orm";
import {
	boolean,
	jsonb,
	pgTable,
	serial,
	text,
	timestamp,
} from "drizzle-orm/pg-core";

import { user } from "./better-auth";
import { branches } from "./branches";
import { companies } from "./shaun/companies";

export const staff = pgTable("staff", {
	aadharNumber: text("aadhar_number"),
	bloodGroup: text(),

	branchAccess: jsonb("branch_access"),
	branchId: serial("branch_id").references(() => branches.id),
	companyId: serial("company_id")
		.notNull()
		.references(() => companies.id),

	createdAt: timestamp("created_at").defaultNow(),

	dateOfBirth: timestamp("date_of_birth"),
	department: text(),
	designation: text(),

	emergencyContacts: jsonb("emergency_contacts"),
	employeeId: text("employee_id").notNull().unique(),

	employmentType: text("employment_type"),
	exitDate: timestamp("exit_date"),
	gender: text(),
	id: serial().primaryKey(),
	isActive: boolean("is_active").default(true),
	joiningDate: timestamp("joining_date"),
	maritalStatus: text(),
	nationality: text().default("India"),

	panNumber: text("pan_number"),
	phoneAlt: text("phone_alt"),
	probationEndDate: timestamp("probation_end_date"),

	reportToId: text("report_to_id").references(() => user.id),
	resignationDate: timestamp("resignation_date"),
	roleId: text("role_id").notNull(),
	updatedAt: timestamp("updated_at").defaultNow(),
	userId: text("user_id")
		.notNull()
		.references(() => user.id),
});

export const staffPermissions = pgTable("staff_permissions", {
	id: serial().primaryKey(),
	permissions: text("permissions").array().notNull().default([]),
	staffId: serial("staff_id")
		.notNull()
		.references(() => staff.id),
});

export const staffRelations = relations(staff, ({ one, many }) => ({
	branch: one(branches, {
		fields: [staff.branchId],
		references: [branches.id],
	}),
	company: one(companies, {
		fields: [staff.companyId],
		references: [companies.id],
	}),
	permissions: many(staffPermissions),
	reportTo: one(user, {
		fields: [staff.reportToId],
		references: [user.id],
	}),
	user: one(user, {
		fields: [staff.userId],
		references: [user.id],
	}),
}));

export const staffPermissionsRelations = relations(
	staffPermissions,
	({ one }) => ({
		staff: one(staff, {
			fields: [staffPermissions.staffId],
			references: [staff.id],
		}),
	}),
);
