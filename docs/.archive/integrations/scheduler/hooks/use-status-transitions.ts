import { useCallback, useMemo, useState } from "react";

import { canTransition, getAvailableTransitions } from "../state-machine";
import type { Appointment, EngineConfig, StatusTransition } from "../types";

export interface UseStatusTransitionsReturn {
	availableTransitions: StatusTransition[];
	canTransitionTo: (status: string) => boolean;
	currentStatus: string;
	isTransitioning: boolean;
	transitionTo: (status: string) => Promise<void>;
}

export function useStatusTransitions<TMeta = Record<string, unknown>>(
	config: EngineConfig<TMeta>,
	appointment: Appointment<TMeta> | null,
	onTransition?: (from: string, to: string) => Promise<void>,
): UseStatusTransitionsReturn {
	const [isTransitioning, setIsTransitioning] = useState(false);
	const { statusWorkflow, plugins } = config;

	const currentStatus = appointment?.status ?? statusWorkflow.initial;

	const availableTransitions = useMemo(
		() =>
			appointment
				? getAvailableTransitions(statusWorkflow, currentStatus, appointment)
				: [],
		[statusWorkflow, currentStatus, appointment],
	);

	const canTransitionTo = useCallback(
		(status: string) =>
			appointment
				? canTransition(statusWorkflow, currentStatus, status, appointment)
				: false,
		[statusWorkflow, currentStatus, appointment],
	);

	const transitionTo = useCallback(
		async (status: string) => {
			if (!appointment) return;
			if (!canTransitionTo(status)) {
				throw new Error(`Invalid transition: ${currentStatus} → ${status}`);
			}

			setIsTransitioning(true);
			try {
				if (onTransition) {
					await onTransition(currentStatus, status);
				}

				for (const plugin of plugins ?? []) {
					if (plugin.onStatusChange) {
						await plugin.onStatusChange(appointment, currentStatus, status);
					}
				}
			} finally {
				setIsTransitioning(false);
			}
		},
		[appointment, canTransitionTo, plugins, currentStatus, onTransition],
	);

	return useMemo(
		() => ({
			availableTransitions,
			canTransitionTo,
			currentStatus,
			isTransitioning,
			transitionTo,
		}),
		[
			availableTransitions,
			canTransitionTo,
			currentStatus,
			isTransitioning,
			transitionTo,
		],
	);
}
