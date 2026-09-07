import type { Appointment, ConflictResult, TimeSlot } from "./types";
import { type Interval, intervalsOverlap } from "./utils/overlap";

function appointmentToInterval(apt: Appointment<any>): Interval {
	return { date: apt.date, end: apt.endTime, start: apt.startTime };
}

export function checkConflict(
	strategy: "strict" | "allow_overlap" | "warn",
	target: TimeSlot,
	existing: Appointment<any>[],
): ConflictResult {
	const targetInterval: Interval = {
		date: target.date,
		end: target.endTime,
		start: target.startTime,
	};

	const conflictingAppointments = existing.filter(
		(e) =>
			e.resourceId === target.resourceId &&
			intervalsOverlap(targetInterval, appointmentToInterval(e)),
	);

	if (conflictingAppointments.length === 0) {
		return {
			conflictingAppointments: [],
			hasConflict: false,
			severity: "block",
		};
	}

	switch (strategy) {
		case "strict":
			return {
				conflictingAppointments,
				hasConflict: true,
				severity: "block",
			};
		case "warn":
			return {
				conflictingAppointments,
				hasConflict: true,
				severity: "warn",
			};
		case "allow_overlap":
			return {
				conflictingAppointments: [],
				hasConflict: false,
				severity: "block",
			};
	}
}

export interface MultiResourceSlot {
	date: string;
	endTime: string;
	resourceId: string;
	startTime: string;
}

export function checkMultiResourceConflict(
	strategy: "strict" | "allow_overlap" | "warn",
	targetSlots: MultiResourceSlot[],
	existingAppointments: Appointment<any>[],
): ConflictResult {
	const conflicts: Appointment<any>[] = [];

	for (const slot of targetSlots) {
		const result = checkConflict(
			strategy,
			{ ...slot, durationMinutes: 0 },
			existingAppointments,
		);
		if (result.hasConflict) {
			conflicts.push(...result.conflictingAppointments);
		}
	}

	const uniqueConflicts = [
		...new Map(conflicts.map((c) => [c.id, c])).values(),
	];

	return {
		conflictingAppointments: uniqueConflicts,
		hasConflict: uniqueConflicts.length > 0,
		severity: strategy === "strict" ? "block" : "warn",
	};
}
