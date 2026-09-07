import type { Appointment, ScheduleStats, TimeSlot } from "./types";
import {
	addMinutes,
	getDaysRange,
	getToday,
	timeToMinutes,
} from "./utils/date";
import { intervalsOverlap } from "./utils/overlap";

export interface AvailabilitySchedule {
	dayOfWeek: number;
	endTime: string;
	maxAppointments: number;
	resourceId: string;
	startTime: string;
}

export interface UnavailabilityBlock {
	date: string;
	endTime: string;
	resourceId: string;
	startTime: string;
}

export interface SlotGenerationConfig {
	date: string;
	schedules: AvailabilitySchedule[];
	slotDuration: number;
	unavailability: UnavailabilityBlock[];
}

export function generateTimeSlots(
	dayStartTime: string,
	dayEndTime: string,
	durationMinutes: number,
): string[] {
	const slots: string[] = [];
	const startMin = timeToMinutes(dayStartTime);
	const endMin = timeToMinutes(dayEndTime);

	for (let m = startMin; m + durationMinutes <= endMin; m += durationMinutes) {
		const hours = Math.floor(m / 60);
		const mins = m % 60;
		slots.push(
			`${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`,
		);
	}
	return slots;
}

export function generateDays(daysAhead: number): string[] {
	return getDaysRange(getToday(), daysAhead + 1);
}

export function buildSlotKey(
	resourceId: string,
	date: string,
	time: string,
): string {
	return `${resourceId}_${date}_${time}`;
}

export function slotFromTime(
	resourceId: string,
	date: string,
	startTime: string,
	durationMinutes: number,
): TimeSlot {
	return {
		date,
		durationMinutes,
		endTime: addMinutes(startTime, durationMinutes),
		resourceId,
		startTime,
	};
}

export function appointmentToSlot<T>(apt: Appointment<T>): TimeSlot {
	return {
		date: apt.date,
		durationMinutes: apt.durationMinutes,
		endTime: apt.endTime,
		resourceId: apt.resourceId,
		startTime: apt.startTime,
	};
}

export function buildScheduleGrid<T>(
	appointments: Appointment<T>[],
	resourceIds: string[],
	days: string[],
	timeSlots: string[],
): Map<string, Map<string, Appointment<T> | null>> {
	const grid = new Map<string, Map<string, Appointment<T> | null>>();

	for (const resourceId of resourceIds) {
		const dayMap = new Map<string, Appointment<T> | null>();
		for (const day of days) {
			for (const time of timeSlots) {
				const key = buildSlotKey(resourceId, day, time);
				dayMap.set(key, null);
			}
		}
		grid.set(resourceId, dayMap);
	}

	for (const apt of appointments) {
		const slotStartMin = timeToMinutes(apt.startTime);
		const slotEndMin = timeToMinutes(apt.endTime);

		for (const time of timeSlots) {
			const timeMin = timeToMinutes(time);
			if (timeMin >= slotStartMin && timeMin < slotEndMin) {
				const key = buildSlotKey(apt.resourceId, apt.date, time);
				const resourceGrid = grid.get(apt.resourceId);
				if (resourceGrid?.has(key)) {
					resourceGrid.set(key, apt);
				}
			}
		}
	}

	return grid;
}

export function computeUtilization<T>(
	appointments: Appointment<T>[],
	resourceId: string,
	totalSlots: number,
	slotDurationMinutes: number,
): number {
	if (totalSlots === 0) return 0;
	const resourceApts = appointments.filter((a) => a.resourceId === resourceId);
	const occupiedSlots = resourceApts.reduce(
		(sum, apt) => sum + apt.durationMinutes / slotDurationMinutes,
		0,
	);
	return Math.min(100, Math.round((occupiedSlots / totalSlots) * 100));
}

export function computeStats<T>(
	appointments: Appointment<T>[],
	statusKeys: string[],
): ScheduleStats {
	const stats: Record<string, number> = { total: appointments.length };
	for (const key of statusKeys) {
		stats[key] = 0;
	}
	for (const apt of appointments) {
		if (stats[apt.status] !== undefined) {
			stats[apt.status]++;
		}
	}
	return stats as ScheduleStats;
}

export function generateAvailableSlots(
	config: SlotGenerationConfig,
): TimeSlot[] {
	const targetDate = new Date(config.date);
	const targetDayOfWeek = targetDate.getDay();
	const daySchedules = config.schedules.filter(
		(s) => s.dayOfWeek === targetDayOfWeek,
	);

	const allSlots: TimeSlot[] = [];

	for (const schedule of daySchedules) {
		let current = timeToMinutes(schedule.startTime);
		const end = timeToMinutes(schedule.endTime);

		while (current + config.slotDuration <= end) {
			const startTime = `${String(Math.floor(current / 60)).padStart(2, "0")}:${String(current % 60).padStart(2, "0")}`;
			const endTime = `${String(Math.floor((current + config.slotDuration) / 60)).padStart(2, "0")}:${String((current + config.slotDuration) % 60).padStart(2, "0")}`;

			const isUnavailable = config.unavailability.some(
				(u) =>
					u.resourceId === schedule.resourceId &&
					u.date === config.date &&
					intervalsOverlap(
						{ date: config.date, end: endTime, start: startTime },
						{ date: u.date, end: u.endTime, start: u.startTime },
					),
			);

			if (!isUnavailable) {
				allSlots.push({
					date: config.date,
					durationMinutes: config.slotDuration,
					endTime,
					resourceId: schedule.resourceId,
					startTime,
				});
			}

			current += config.slotDuration;
		}
	}

	return allSlots;
}
