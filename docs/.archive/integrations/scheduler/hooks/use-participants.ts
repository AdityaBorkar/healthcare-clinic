import { useCallback, useMemo, useState } from "react";

import type { Appointment, EngineConfig, Participant } from "../types";

export function useParticipants<TMeta = Record<string, unknown>>(
	config: EngineConfig<TMeta>,
	appointment: Appointment<TMeta> | null,
	onUpdate?: (participants: Participant[]) => Promise<void>,
) {
	const [participants, setParticipants] = useState<Participant[]>(
		appointment?.participants ?? [],
	);
	const [isUpdating, setIsUpdating] = useState(false);

	const add = useCallback(
		(p: Omit<Participant, "status">) => {
			setParticipants((prev) => {
				const roleConfig = config.participantRoles?.find(
					(r) => r.key === p.role,
				);
				if (roleConfig?.maxCount) {
					const count = prev.filter((x) => x.role === p.role).length;
					if (count >= roleConfig.maxCount) return prev;
				}
				const next = [...prev, { ...p, status: "assigned" as const }];
				if (onUpdate) {
					setIsUpdating(true);
					onUpdate(next).finally(() => setIsUpdating(false));
				}
				return next;
			});
		},
		[config.participantRoles, onUpdate],
	);

	const remove = useCallback(
		(id: string) => {
			setParticipants((prev) => {
				const next = prev.filter((p) => p.id !== id);
				if (onUpdate) {
					setIsUpdating(true);
					onUpdate(next).finally(() => setIsUpdating(false));
				}
				return next;
			});
		},
		[onUpdate],
	);

	const updateStatus = useCallback(
		(id: string, status: Participant["status"]) => {
			setParticipants((prev) => {
				const next = prev.map((p) => (p.id === id ? { ...p, status } : p));
				if (onUpdate) {
					setIsUpdating(true);
					onUpdate(next).finally(() => setIsUpdating(false));
				}
				return next;
			});
		},
		[onUpdate],
	);

	const byRole = useCallback(
		(role: string) => participants.filter((p) => p.role === role),
		[participants],
	);

	const requiredRoles = useMemo(
		() => (config.participantRoles ?? []).map((r) => r.key),
		[config.participantRoles],
	);

	const missingRoles = useMemo(
		() =>
			requiredRoles.filter((role) => {
				const roleConfig = config.participantRoles?.find((r) => r.key === role);
				const minCount = roleConfig?.maxCount ?? 1;
				const count = participants.filter((p) => p.role === role).length;
				return count < minCount;
			}),
		[requiredRoles, participants, config.participantRoles],
	);

	return useMemo(
		() => ({
			add,
			byRole,
			isUpdating,
			missingRoles,
			participants,
			remove,
			requiredRoles,
			updateStatus,
		}),
		[
			add,
			byRole,
			isUpdating,
			missingRoles,
			participants,
			remove,
			requiredRoles,
			updateStatus,
		],
	);
}
