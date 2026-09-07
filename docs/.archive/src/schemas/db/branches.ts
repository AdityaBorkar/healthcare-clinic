import { relations } from "drizzle-orm";
import { boolean, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

import { companies } from "./shaun/companies";
import { staff } from "./staff";

export const branches = pgTable("branches", {
	branchCode: text("branch_code").notNull(),
	companyId: serial("company_id")
		.notNull()
		.references(() => companies.id),
	createdAt: timestamp("created_at").defaultNow(),
	gstn: text(),
	id: serial().primaryKey(),
	isActive: boolean("is_active").notNull().default(true),
	name: text().notNull(),
	updatedAt: timestamp("updated_at").defaultNow(),
});

export const branchRelations = relations(branches, ({ one, many }) => ({
	company: one(companies, {
		fields: [branches.companyId],
		references: [companies.id],
	}),
	staff: many(staff),
}));
