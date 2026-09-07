import { useMemo } from "react";

import {
	buildScheduleGrid,
	buildSlotKey,
	computeStats,
	computeUtilization,
	generateDays,
	generateTimeSlots,
} from "../time-slots";
import type {
	Appointment,
	EngineConfig,
	Resource,
	ScheduleGridData,
} from "../types";

export function useScheduleGrid<TMeta = Record<string, unknown>>(
	config: EngineConfig<TMeta>,
	appointments: Appointment<TMeta>[],
	resources: Resource[],
): ScheduleGridData<TMeta> {
	const {
		dayEndTime,
		dayStartTime,
		daysAhead,
		statusWorkflow,
		timeSlotDuration,
	} = config;

	return useMemo(() => {
		const days = generateDays(daysAhead);
		const timeSlots = generateTimeSlots(
			dayStartTime,
			dayEndTime,
			timeSlotDuration,
		);
		const resourceIds = resources.map((r) => r.id);
		const grid = buildScheduleGrid(appointments, resourceIds, days, timeSlots);

		const getSlot = (resourceId: string, date: string, time: string) => {
			const key = buildSlotKey(resourceId, date, time);
			return grid.get(resourceId)?.get(key) ?? null;
		};

		const getResourceDay = (resourceId: string, date: string) =>
			appointments.filter(
				(a) => a.resourceId === resourceId && a.date === date,
			);

		const utilization = new Map<string, number>();
		for (const r of resources) {
			utilization.set(
				r.id,
				computeUtilization(
					appointments,
					r.id,
					timeSlots.length,
					timeSlotDuration,
				),
			);
		}

		const statusKeys = statusWorkflow.statuses.map((s) => s.key);

		return {
			days,
			getResourceDay,
			getSlot,
			grid,
			stats: computeStats(appointments, statusKeys),
			timeSlots,
			utilization,
		};
	}, [
		appointments,
		dayEndTime,
		dayStartTime,
		daysAhead,
		resources,
		statusWorkflow,
		timeSlotDuration,
	]);
}
