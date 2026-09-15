import {
	CreateFacilityBlockSchema,
	CreateFacilitySchema,
	FacilityFiltersSchema,
	FacilityIdSchema,
	FacilityOverlapQuerySchema,
	FacilityStatusQuerySchema,
	LogSterilizationSchema,
	OccupyFacilitySchema,
	ReleaseFacilitySchema,
	SetFacilityScheduleSchema,
	UpdateFacilitySchema,
} from "@aspen-os/healthcare";

import { scopedAuthMiddleware } from "../middlewares/scoped_auth";

export const create = scopedAuthMiddleware
	.input(CreateFacilitySchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.facilities.create.run({ input }, { actorId }),
			);
		} catch (error) {
			throw new Error(
				`Facility creation failed (${error instanceof Error ? error.message : "unknown error"}); verify the details and retry`,
			);
		}
	});

export const get = scopedAuthMiddleware
	.input(FacilityIdSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.facilities.get.run({ input }, { actorId }),
			);
		} catch (error) {
			throw new Error(
				`Facility lookup failed (${error instanceof Error ? error.message : "unknown error"}); check the ID and retry`,
			);
		}
	});

export const list = scopedAuthMiddleware
	.input(FacilityFiltersSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.facilities.list.run({ input }, { actorId }),
			);
		} catch (error) {
			throw new Error(
				`Facility list failed (${error instanceof Error ? error.message : "unknown error"}); retry`,
			);
		}
	});

export const update = scopedAuthMiddleware
	.input(UpdateFacilitySchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.facilities.update.run({ input }, { actorId }),
			);
		} catch (error) {
			throw new Error(
				`Facility update failed (${error instanceof Error ? error.message : "unknown error"}); check the ID and retry`,
			);
		}
	});

export const setSchedule = scopedAuthMiddleware
	.input(SetFacilityScheduleSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.facilities.setSchedule.run({ input }, { actorId }),
			);
		} catch (error) {
			throw new Error(
				`Facility schedule save failed (${error instanceof Error ? error.message : "unknown error"}); verify hours and retry`,
			);
		}
	});

export const addBlock = scopedAuthMiddleware
	.input(CreateFacilityBlockSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.facilities.addBlock.run({ input }, { actorId }),
			);
		} catch (error) {
			throw new Error(
				`Facility block failed (${error instanceof Error ? error.message : "unknown error"}); verify the range and retry`,
			);
		}
	});

export const overlap = scopedAuthMiddleware
	.input(FacilityOverlapQuerySchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.facilities.overlap.run({ input }, { actorId }),
			);
		} catch (error) {
			throw new Error(
				`Overlap check failed (${error instanceof Error ? error.message : "unknown error"}); verify the range and retry`,
			);
		}
	});

export const occupy = scopedAuthMiddleware
	.input(OccupyFacilitySchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.facilities.occupy.run({ input }, { actorId }),
			);
		} catch (error) {
			throw new Error(
				`Facility occupy failed (${error instanceof Error ? error.message : "unknown error"}); check occupancy and retry`,
			);
		}
	});

export const release = scopedAuthMiddleware
	.input(ReleaseFacilitySchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.facilities.release.run({ input }, { actorId }),
			);
		} catch (error) {
			throw new Error(
				`Facility release failed (${error instanceof Error ? error.message : "unknown error"}); check occupancy and retry`,
			);
		}
	});

export const logSterilization = scopedAuthMiddleware
	.input(LogSterilizationSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.facilities.logSterilization.run({ input }, { actorId }),
			);
		} catch (error) {
			throw new Error(
				`Sterilization log failed (${error instanceof Error ? error.message : "unknown error"}); verify the facility and retry`,
			);
		}
	});

export const statusBoard = scopedAuthMiddleware
	.input(FacilityStatusQuerySchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.facilities.statusBoard.run({ input }, { actorId }),
			);
		} catch (error) {
			throw new Error(
				`Status board failed (${error instanceof Error ? error.message : "unknown error"}); retry`,
			);
		}
	});
