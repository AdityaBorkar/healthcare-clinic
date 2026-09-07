import type {
	Appointment,
	AppointmentAdapter,
	AppointmentFilters,
	CreateAppointmentInput,
} from "./types";

export function createMockAdapter<
	TMeta = Record<string, unknown>,
>(): AppointmentAdapter<TMeta> {
	const store = new Map<string, Appointment<TMeta>>();

	function matchesFilters(
		apt: Appointment<TMeta>,
		filters: AppointmentFilters,
	): boolean {
		if (filters.resourceId && apt.resourceId !== filters.resourceId)
			return false;
		if (filters.date && apt.date !== filters.date) return false;
		if (filters.startDate && apt.date < filters.startDate) return false;
		if (filters.endDate && apt.date > filters.endDate) return false;
		if (filters.status && apt.status !== filters.status) return false;
		return true;
	}

	return {
		async create(input: CreateAppointmentInput<TMeta>) {
			const now = new Date().toISOString();
			const apt: Appointment<TMeta> = {
				createdAt: now,
				date: input.date,
				durationMinutes: input.durationMinutes,
				endTime: input.endTime,
				id: crypto.randomUUID(),
				metadata: input.metadata,
				notes: input.notes,
				participants: input.participants ?? [],
				priority: input.priority,
				resourceId: input.resourceId,
				startTime: input.startTime,
				status: input.status ?? "scheduled",
				updatedAt: now,
			};
			store.set(apt.id, apt);
			return apt;
		},

		async get(id: string) {
			const apt = store.get(id);
			if (!apt) throw new Error(`Appointment ${id} not found`);
			return apt;
		},

		async list(filters: AppointmentFilters) {
			return [...store.values()].filter((apt) => matchesFilters(apt, filters));
		},

		async remove(id: string) {
			store.delete(id);
		},

		async update(id: string, input: Partial<Appointment<TMeta>>) {
			const existing = store.get(id);
			if (!existing) throw new Error(`Appointment ${id} not found`);
			const updated: Appointment<TMeta> = {
				...existing,
				...input,
				updatedAt: new Date().toISOString(),
			};
			store.set(id, updated);
			return updated;
		},
	};
}
