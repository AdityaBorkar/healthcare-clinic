import {
	boolean,
	jsonb,
	pgTable,
	serial,
	text,
	timestamp,
} from "drizzle-orm/pg-core";

export const patients = pgTable("patients", {
	active: boolean("is_active").notNull().default(true),
	addressLine1: text("address_line_1"),
	addressLine2: text("address_line_2"),
	allergies: text(),
	birthDate: text("birth_date"),
	bloodGroup: text("blood_group"),
	city: text(),
	country: text().default("India"),
	createdAt: timestamp("created_at").defaultNow(),
	email: text(),
	emergencyContacts:
		jsonb("emergency_contacts").$type<
			Array<{ name: string; phone: string; relation: string }>
		>(),
	gender: text(),
	id: serial().primaryKey(),
	identifiers:
		jsonb("identifiers").$type<
			Array<{ system?: string; type: string; value: string }>
		>(),
	insurancePolicyNumber: text("insurance_policy_number"),
	insuranceProvider: text("insurance_provider"),
	maritalStatus: text("marital_status"),
	mrn: text("mrn").unique(),
	name: text().notNull(),
	nationality: text().default("Indian"),
	occupation: text(),
	phone: text(),
	phoneAlt: text("phone_alt"),
	photoUrl: text("photo_url"),
	pincode: text(),
	state: text(),
	updatedAt: timestamp("updated_at").defaultNow(),
});

export type Patient = typeof patients.$inferSelect;
export type NewPatient = typeof patients.$inferInsert;
