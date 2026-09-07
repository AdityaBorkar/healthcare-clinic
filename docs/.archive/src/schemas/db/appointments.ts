import { relations } from "drizzle-orm";
import {
	index,
	integer,
	jsonb,
	pgTable,
	serial,
	text,
	timestamp,
} from "drizzle-orm/pg-core";

export const appointments = pgTable(
	"appointments",
	{
		branchId: integer("branch_id").notNull(),
		createdAt: timestamp("created_at").defaultNow(),
		date: text("date").notNull(),
		durationMinutes: integer("duration_minutes").notNull(),
		endTime: text("end_time").notNull(),
		id: serial().primaryKey(),
		metadata: jsonb("metadata").notNull(),
		notes: text(),
		priority: text("priority"),
		resourceId: text("resource_id").notNull(),
		resourceType: text("resource_type").notNull(),
		startTime: text("start_time").notNull(),
		status: text("status").notNull(),
		updatedAt: timestamp("updated_at").defaultNow(),
	},
	(t) => [
		index("appointments_branch_idx").on(t.branchId),
		index("appointments_resource_date_idx").on(t.resourceId, t.date),
		index("appointments_status_idx").on(t.status),
	],
);

export const appointmentParticipants = pgTable(
	"appointment_participants",
	{
		appointmentId: integer("appointment_id")
			.notNull()
			.references(() => appointments.id, { onDelete: "cascade" }),
		createdAt: timestamp("created_at").defaultNow(),
		id: serial().primaryKey(),
		participantId: text("participant_id").notNull(),
		participantName: text("participant_name").notNull(),
		role: text("role").notNull(),
		status: text("status").notNull().default("assigned"),
	},
	(t) => [index("appointment_participants_apt_idx").on(t.appointmentId)],
);

export const appointmentStatusHistory = pgTable(
	"appointment_status_history",
	{
		appointmentId: integer("appointment_id")
			.notNull()
			.references(() => appointments.id, { onDelete: "cascade" }),
		changedAt: timestamp("changed_at").defaultNow(),
		changedBy: text("changed_by").notNull(),
		fromStatus: text("from_status"),
		id: serial().primaryKey(),
		toStatus: text("to_status").notNull(),
	},
	(t) => [index("appointment_status_history_apt_idx").on(t.appointmentId)],
);

export const appointmentsRelations = relations(appointments, ({ many }) => ({
	participants: many(appointmentParticipants),
	statusHistory: many(appointmentStatusHistory),
}));

export const appointmentParticipantsRelations = relations(
	appointmentParticipants,
	({ one }) => ({
		appointment: one(appointments, {
			fields: [appointmentParticipants.appointmentId],
			references: [appointments.id],
		}),
	}),
);

export const appointmentStatusHistoryRelations = relations(
	appointmentStatusHistory,
	({ one }) => ({
		appointment: one(appointments, {
			fields: [appointmentStatusHistory.appointmentId],
			references: [appointments.id],
		}),
	}),
);

export type AppointmentRow = typeof appointments.$inferSelect;
export type NewAppointmentRow = typeof appointments.$inferInsert;
export type AppointmentParticipantRow =
	typeof appointmentParticipants.$inferSelect;
export type NewAppointmentParticipantRow =
	typeof appointmentParticipants.$inferInsert;
export type AppointmentStatusHistoryRow =
	typeof appointmentStatusHistory.$inferSelect;
export type NewAppointmentStatusHistoryRow =
	typeof appointmentStatusHistory.$inferInsert;
