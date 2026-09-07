import { client } from "#/lib/rpc";
import type {
	Appointment,
	AppointmentAdapter,
	AppointmentFilters,
	CreateAppointmentInput,
} from "#/scheduler";

export interface RpcAdapterOptions {
	resourceType?: string;
}

export function createRpcAdapter<TMeta = Record<string, unknown>>(
	options?: RpcAdapterOptions,
): AppointmentAdapter<TMeta> {
	return {
		async create(
			input: CreateAppointmentInput<TMeta>,
		): Promise<Appointment<TMeta>> {
			return client.appointments.create({
				...input,
				metadata: input.metadata as Record<string, unknown>,
				resourceType:
					((input as unknown as Record<string, unknown>)
						.resourceType as string) ??
					options?.resourceType ??
					"practitioner",
			}) as Promise<Appointment<TMeta>>;
		},

		async get(id: string): Promise<Appointment<TMeta>> {
			return client.appointments.get({ id }) as Promise<Appointment<TMeta>>;
		},

		async list(filters: AppointmentFilters): Promise<Appointment<TMeta>[]> {
			return client.appointments.list(filters) as Promise<Appointment<TMeta>[]>;
		},

		async remove(id: string): Promise<void> {
			await client.appointments.delete({ id });
		},

		async update(
			id: string,
			input: Partial<Appointment<TMeta>>,
		): Promise<Appointment<TMeta>> {
			const { metadata, ...rest } = input;
			return client.appointments.update({
				...rest,
				id,
				metadata: metadata as Record<string, unknown> | undefined,
			}) as Promise<Appointment<TMeta>>;
		},
	};
}
