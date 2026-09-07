import { useCallback, useMemo, useRef, useState } from "react";

import { checkConflict } from "../conflict";
import type {
	Appointment,
	ConflictResult,
	EngineConfig,
	TimeSlot,
} from "../types";

export function useConflictCheck<TMeta = Record<string, unknown>>(
	config: EngineConfig<TMeta>,
	appointments: Appointment<TMeta>[],
) {
	const [lastResult, setLastResult] = useState<ConflictResult | null>(null);
	const appointmentsRef = useRef(appointments);
	appointmentsRef.current = appointments;

	const check = useCallback(
		(slot: TimeSlot, excludeId?: string) => {
			const filtered = excludeId
				? appointmentsRef.current.filter((a) => a.id !== excludeId)
				: appointmentsRef.current;

			const result = checkConflict(config.conflictStrategy, slot, filtered);
			setLastResult(result);
			return result;
		},
		[config.conflictStrategy],
	);

	return useMemo(
		() => ({
			check,
			conflicts: lastResult?.conflictingAppointments ?? [],
			hasConflict: lastResult?.hasConflict ?? false,
			lastResult,
		}),
		[check, lastResult],
	);
}
