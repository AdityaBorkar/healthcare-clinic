import { relations } from "drizzle-orm";
import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const cdcSink = pgTable("cdc_sink", {
	id: serial().primaryKey(),
	mvccId: text("mvcc_id").notNull().unique(),
	operation: text("operation").notNull(),
	sourceId: text("source_id").notNull(),
	sourceTable: text("source_table").notNull(),
	timestamp: timestamp("timestamp").notNull().defaultNow(),
	userId: text("user_id").notNull(),
});

export const cdcStaff = pgTable("cdc_staff", {
	field: text("field").notNull(),
	id: serial().primaryKey(),
	newValue: text("new_value"),
	oldValue: text("old_value"),
	sinkId: integer("sink_id")
		.notNull()
		.references(() => cdcSink.id),
});

export const cdcSinkRelations = relations(cdcSink, ({ many }) => ({
	staffEntries: many(cdcStaff),
}));

export const cdcStaffRelations = relations(cdcStaff, ({ one }) => ({
	sink: one(cdcSink, {
		fields: [cdcStaff.sinkId],
		references: [cdcSink.id],
	}),
}));
