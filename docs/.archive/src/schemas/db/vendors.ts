import {
	boolean,
	jsonb,
	pgTable,
	serial,
	text,
	timestamp,
} from "drizzle-orm/pg-core";

export const vendors = pgTable("vendors", {
	active: boolean("is_active").notNull().default(true),
	cin: text(),
	createdAt: timestamp("created_at").defaultNow(),
	email: text(),
	gstn: text(),
	id: serial().primaryKey(),
	identifiers:
		jsonb("identifiers").$type<
			Array<{ system: string; type: string; value: string }>
		>(),
	iec: text(),
	name: text().notNull(),
	organizationType: text("organization_type"),
	pan: text(),
	phone: text(),
	tan: text(),
	udyamRegistration: text("udyam_registration"),
	updatedAt: timestamp("updated_at").defaultNow(),
	vendorType: text("vendor_type"),
	website: text(),
});

export type Vendor = typeof vendors.$inferSelect;
export type NewVendor = typeof vendors.$inferInsert;
