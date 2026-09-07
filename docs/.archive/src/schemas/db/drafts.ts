import { jsonb, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const drafts = pgTable("drafts", {
	createdAt: timestamp("created_at").defaultNow(),
	data: jsonb("data").$type<Record<string, unknown>>().notNull(),
	formType: text("form_type").notNull(),
	id: serial().primaryKey(),
	label: text().notNull(),
	updatedAt: timestamp("updated_at").defaultNow(),
});

export type Draft = typeof drafts.$inferSelect;
export type NewDraft = typeof drafts.$inferInsert;
