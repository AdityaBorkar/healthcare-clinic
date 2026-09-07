import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import * as v from "valibot";

import type {
	Appointment,
	AppointmentAdapter,
	AppointmentFilters,
	CreateAppointmentInput,
	EngineConfig,
} from "../types";

export interface UseAppointmentsOptions<TMeta> {
	adapter: AppointmentAdapter<TMeta>;
	enabled?: boolean;
	filters?: AppointmentFilters;
}

export function useAppointments<TMeta = Record<string, unknown>>(
	config: EngineConfig<TMeta>,
	options: UseAppointmentsOptions<TMeta>,
) {
	const { adapter, filters, enabled = true } = options;
	const queryClient = useQueryClient();

	const queryKey = useMemo(
		() => ["appointments", config.resourceType, filters],
		[config.resourceType, filters],
	);

	const query = useQuery({
		enabled,
		queryFn: () => adapter.list(filters ?? {}),
		queryKey,
	});

	const createMutation = useMutation({
		mutationFn: async (input: CreateAppointmentInput<TMeta>) => {
			if (config.metadataSchema && input.metadata) {
				v.parse(config.metadataSchema, input.metadata);
			}

			for (const plugin of config.plugins ?? []) {
				if (plugin.onBeforeCreate) await plugin.onBeforeCreate(input);
			}

			const apt = await adapter.create(input);

			for (const plugin of config.plugins ?? []) {
				if (plugin.onAfterCreate) await plugin.onAfterCreate(apt);
			}

			return apt;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey });
		},
	});

	const updateMutation = useMutation({
		mutationFn: ({
			id,
			input,
		}: {
			id: string;
			input: Partial<Appointment<TMeta>>;
		}) => adapter.update(id, input),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey });
		},
	});

	const removeMutation = useMutation({
		mutationFn: (id: string) => adapter.remove(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey });
		},
	});

	const appointments = query.data ?? [];

	const getByResource = useCallback(
		(resourceId: string) =>
			appointments.filter((a) => a.resourceId === resourceId),
		[appointments],
	);

	const getByDate = useCallback(
		(date: string) => appointments.filter((a) => a.date === date),
		[appointments],
	);

	const getBySlot = useCallback(
		(resourceId: string, date: string, time: string) =>
			appointments.find(
				(a) =>
					a.resourceId === resourceId &&
					a.date === date &&
					a.startTime <= time &&
					a.endTime > time,
			),
		[appointments],
	);

	const getByStatus = useCallback(
		(status: string) => appointments.filter((a) => a.status === status),
		[appointments],
	);

	const getById = useCallback(
		(id: string) => appointments.find((a) => a.id === id),
		[appointments],
	);

	return useMemo(
		() => ({
			appointments,
			create: createMutation.mutateAsync,
			error: query.error,
			getByDate,
			getById,
			getByResource,
			getBySlot,
			getByStatus,
			isLoading: query.isLoading,
			refetch: query.refetch,
			remove: removeMutation.mutateAsync,
			update: updateMutation.mutateAsync,
		}),
		[
			appointments,
			createMutation.mutateAsync,
			query.error,
			query.isLoading,
			query.refetch,
			getByDate,
			getById,
			getByResource,
			getBySlot,
			getByStatus,
			removeMutation.mutateAsync,
			updateMutation.mutateAsync,
		],
	);
}
