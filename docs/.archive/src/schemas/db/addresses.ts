import { relations } from "drizzle-orm";
import {
	boolean,
	index,
	integer,
	pgTable,
	serial,
	text,
	timestamp,
} from "drizzle-orm/pg-core";

export const addresses = pgTable(
	"addresses",
	{
		addressLine1: text("address_line_1"),
		addressLine2: text("address_line_2"),
		city: text(),
		country: text().default("India"),
		createdAt: timestamp("created_at").defaultNow(),
		id: serial().primaryKey(),
		isDefault: boolean("is_default").notNull().default(false),
		label: text(),
		ownerId: integer("owner_id").notNull(),
		ownerType: text("owner_type").notNull(),
		pincode: text(),
		state: text(),
		updatedAt: timestamp("updated_at").defaultNow(),
	},
	(t) => [index("addresses_owner_idx").on(t.ownerType, t.ownerId)],
);

export const addressesRelations = relations(addresses, () => ({}));

export type Address = typeof addresses.$inferSelect;
export type NewAddress = typeof addresses.$inferInsert;
