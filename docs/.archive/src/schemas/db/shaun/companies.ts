import { relations } from "drizzle-orm";
import { pgSchema, serial, text, timestamp } from "drizzle-orm/pg-core";

import { branches } from "../branches";
import { staff } from "../staff";

export const shaun = pgSchema("shaun");

export const companies = shaun.table("companies", {
	createdAt: timestamp("created_at").defaultNow(),
	gstn: text(),
	id: serial().primaryKey(),
	name: text().notNull(),
	updatedAt: timestamp("updated_at").defaultNow(),
});

export const companyRelations = relations(companies, ({ many }) => ({
	branches: many(branches),
	staff: many(staff),
}));
