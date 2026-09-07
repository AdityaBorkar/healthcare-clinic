import { and, eq, gte, lte } from "drizzle-orm";

import { db } from "#/lib/db/server";
import type {
	Appointment,
	AppointmentAdapter,
	AppointmentFilters,
	CreateAppointmentInput,
	Participant,
} from "#/scheduler";
import {
	appointmentParticipants,
	appointmentStatusHistory,
	appointments,
} from "#/schemas/db";

export interface DrizzleCreateInput<TMeta>
	extends CreateAppointmentInput<TMeta> {
	branchId: number;
	changedBy?: string;
	notes?: string;
	resourceType?: string;
}

export interface DrizzleUpdateInput<TMeta> extends Partial<Appointment<TMeta>> {
	changedBy?: string;
	notes?: string;
}

export function createDrizzleAdapter<
	TMeta = Record<string, unknown>,
>(): AppointmentAdapter<TMeta> {
	const adapter: AppointmentAdapter<TMeta> = {
		async create(
			input: CreateAppointmentInput<TMeta>,
		): Promise<Appointment<TMeta>> {
			const ext = input as DrizzleCreateInput<TMeta>;
			return db.transaction(async (tx) => {
				const [apt] = await tx
					.insert(appointments)
					.values({
						branchId: ext.branchId,
						date: input.date,
						durationMinutes: input.durationMinutes,
						endTime: input.endTime,
						metadata: input.metadata as Record<string, unknown>,
						notes: ext.notes,
						priority: input.priority,
						resourceId: input.resourceId,
						resourceType: ext.resourceType ?? "facility",
						startTime: input.startTime,
						status: input.status ?? "scheduled",
					})
					.returning();

				if (input.participants?.length) {
					await tx.insert(appointmentParticipants).values(
						input.participants.map((p) => ({
							appointmentId: apt.id,
							participantId: p.id,
							participantName: p.name,
							role: p.role,
							status: p.status ?? "assigned",
						})),
					);
				}

				if (ext.changedBy) {
					await tx.insert(appointmentStatusHistory).values({
						appointmentId: apt.id,
						changedBy: ext.changedBy,
						fromStatus: null,
						toStatus: apt.status,
					});
				}

				return adapter.get(String(apt.id));
			});
		},

		async get(id: string): Promise<Appointment<TMeta>> {
			const row = await db.query.appointments.findFirst({
				where: eq(appointments.id, Number(id)),
				with: { participants: true },
			});

			if (!row) throw new Error(`Appointment ${id} not found`);
			return toAppointment<TMeta>(row);
		},
		async list(filters: AppointmentFilters): Promise<Appointment<TMeta>[]> {
			const conditions = [];

			if (filters.resourceId) {
				conditions.push(eq(appointments.resourceId, filters.resourceId));
			}
			if (filters.date) {
				conditions.push(eq(appointments.date, filters.date));
			}
			if (filters.startDate && filters.endDate) {
				conditions.push(gte(appointments.date, filters.startDate));
				conditions.push(lte(appointments.date, filters.endDate));
			}
			if (filters.status) {
				conditions.push(eq(appointments.status, filters.status));
			}

			const rows = await db.query.appointments.findMany({
				orderBy: (a, { asc }) => [asc(a.date), asc(a.startTime)],
				where: conditions.length > 0 ? and(...conditions) : undefined,
				with: { participants: true },
			});

			return rows.map((row) => toAppointment<TMeta>(row));
		},

		async remove(id: string): Promise<void> {
			await db.delete(appointments).where(eq(appointments.id, Number(id)));
		},

		async update(
			id: string,
			input: Partial<Appointment<TMeta>>,
		): Promise<Appointment<TMeta>> {
			const ext = input as DrizzleUpdateInput<TMeta>;
			return db.transaction(async (tx) => {
				if (ext.status) {
					const current = await tx.query.appointments.findFirst({
						where: eq(appointments.id, Number(id)),
					});

					if (current && current.status !== ext.status) {
						await tx.insert(appointmentStatusHistory).values({
							appointmentId: Number(id),
							changedBy: ext.changedBy ?? "system",
							fromStatus: current.status,
							toStatus: ext.status,
						});
					}
				}

				const updateData: Record<string, unknown> = {
					updatedAt: new Date(),
				};

				if (input.date !== undefined) updateData.date = input.date;
				if (input.startTime !== undefined)
					updateData.startTime = input.startTime;
				if (input.endTime !== undefined) updateData.endTime = input.endTime;
				if (input.durationMinutes !== undefined)
					updateData.durationMinutes = input.durationMinutes;
				if (input.status !== undefined) updateData.status = input.status;
				if (input.priority !== undefined) updateData.priority = input.priority;
				if (ext.notes !== undefined) updateData.notes = ext.notes;
				if (input.metadata !== undefined)
					updateData.metadata = input.metadata as Record<string, unknown>;

				await tx
					.update(appointments)
					.set(updateData)
					.where(eq(appointments.id, Number(id)));

				if (input.participants) {
					await tx
						.delete(appointmentParticipants)
						.where(eq(appointmentParticipants.appointmentId, Number(id)));
					await tx.insert(appointmentParticipants).values(
						input.participants.map((p) => ({
							appointmentId: Number(id),
							participantId: p.id,
							participantName: p.name,
							role: p.role,
							status: p.status ?? "assigned",
						})),
					);
				}

				return adapter.get(id);
			});
		},
	};

	return adapter;
}

function toAppointment<TMeta>(
	row: typeof appointments.$inferSelect & {
		participants: (typeof appointmentParticipants.$inferSelect)[];
	},
): Appointment<TMeta> {
	return {
		createdAt: row.createdAt?.toISOString() ?? "",
		date: row.date,
		durationMinutes: row.durationMinutes,
		endTime: row.endTime,
		id: String(row.id),
		metadata: row.metadata as TMeta,
		participants: row.participants.map(
			(p) =>
				({
					id: p.participantId,
					name: p.participantName,
					role: p.role,
					status: p.status as Participant["status"],
				}) satisfies Participant,
		),
		priority: row.priority ?? undefined,
		resourceId: row.resourceId,
		startTime: row.startTime,
		status: row.status,
		updatedAt: row.updatedAt?.toISOString() ?? "",
	};
}
