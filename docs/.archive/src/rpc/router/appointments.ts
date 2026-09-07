import * as v from "valibot";

import { createDrizzleAdapter } from "#/lib/appointment-engine/adapter";
import { AuthProcedure } from "#/rpc/procedure";

const listAppointmentsSchema = v.object({
	date: v.optional(v.string()),
	endDate: v.optional(v.string()),
	resourceId: v.optional(v.string()),
	startDate: v.optional(v.string()),
	status: v.optional(v.string()),
});

const participantSchema = v.object({
	id: v.string(),
	name: v.string(),
	role: v.string(),
	status: v.optional(v.string()),
});

const createAppointmentSchema = v.object({
	date: v.string(),
	durationMinutes: v.number(),
	endTime: v.string(),
	metadata: v.record(v.string(), v.unknown()),
	notes: v.optional(v.string()),
	participants: v.optional(v.array(participantSchema)),
	priority: v.optional(v.string()),
	resourceId: v.string(),
	resourceType: v.string(),
	startTime: v.string(),
	status: v.optional(v.string()),
});

const updateAppointmentSchema = v.object({
	date: v.optional(v.string()),
	durationMinutes: v.optional(v.number()),
	endTime: v.optional(v.string()),
	id: v.string(),
	metadata: v.optional(v.record(v.string(), v.unknown())),
	notes: v.optional(v.string()),
	participants: v.optional(v.array(participantSchema)),
	priority: v.optional(v.string()),
	resourceId: v.optional(v.string()),
	startTime: v.optional(v.string()),
	status: v.optional(v.string()),
});

export const listAppointments = AuthProcedure.meta({
	permissions: ["appointments:read"],
})
	.input(listAppointmentsSchema)
	.handler(async ({ input }) => {
		const adapter = createDrizzleAdapter();
		return adapter.list(input);
	});

export const getAppointment = AuthProcedure.meta({
	permissions: ["appointments:read"],
})
	.input(v.object({ id: v.string() }))
	.handler(async ({ input }) => {
		const adapter = createDrizzleAdapter();
		return adapter.get(input.id);
	});

export const createAppointment = AuthProcedure.meta({
	permissions: ["appointments:write"],
})
	.input(createAppointmentSchema)
	.handler(async ({ context, input }) => {
		const adapter = createDrizzleAdapter();
		const branchId = context.headers.get("x-branch-id");
		const staffCtx = context as unknown as {
			staffRecord: { userId: string };
		};
		return adapter.create({
			...input,
			branchId: branchId ? Number(branchId) : 0,
			changedBy: staffCtx.staffRecord.userId,
		} as Parameters<typeof adapter.create>[0]);
	});

export const updateAppointment = AuthProcedure.meta({
	permissions: ["appointments:write"],
})
	.input(updateAppointmentSchema)
	.handler(async ({ context, input }) => {
		const adapter = createDrizzleAdapter();
		const staffCtx = context as unknown as {
			staffRecord: { userId: string };
		};
		const { id, ...rest } = input;
		return adapter.update(id, {
			...rest,
			changedBy: staffCtx.staffRecord.userId,
		} as Parameters<typeof adapter.update>[1]);
	});

export const deleteAppointment = AuthProcedure.meta({
	permissions: ["appointments:delete"],
})
	.input(v.object({ id: v.string() }))
	.handler(async ({ input }) => {
		const adapter = createDrizzleAdapter();
		await adapter.remove(input.id);
		return { success: true };
	});

export const updateAppointmentStatus = AuthProcedure.meta({
	permissions: ["appointments:write"],
})
	.input(
		v.object({
			id: v.string(),
			status: v.string(),
		}),
	)
	.handler(async ({ context, input }) => {
		const adapter = createDrizzleAdapter();
		const staffCtx = context as unknown as {
			staffRecord: { userId: string };
		};
		return adapter.update(input.id, {
			changedBy: staffCtx.staffRecord.userId,
			status: input.status,
		} as Parameters<typeof adapter.update>[1]);
	});
