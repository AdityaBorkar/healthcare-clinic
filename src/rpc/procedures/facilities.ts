import {
	FacilityBlockSchema,
	FacilityCreateSchema,
	FacilityIdSchema,
	FacilityListSchema,
	FacilityPatchSchema,
	FacilityScheduleSchema,
	FacilityStatusQuerySchema,
	OccupySchema,
	ReleaseSchema,
	SterilizationLogSchema,
} from "#/schemas/facilities";
import { scopedAuthMiddleware } from "../middlewares/scoped_auth";

// P0-9: map extended OPD/clinic categories to the closest backend-supported
// bucket until the Aspen FacilityCategory picklist grows them.
type BackendCategory =
	| "consultation"
	| "diagnostics"
	| "pharmacy"
	| "procedure"
	| "support"
	| "tele"
	| "ward";

function toBackendCategory(category: string): BackendCategory {
	switch (category) {
		case "ot":
		case "chair":
		case "therapy":
			return "procedure";
		case "bed":
			return "ward";
		case "mri":
		case "ct":
		case "xray":
		case "usg":
			return "diagnostics";
		case "nadi":
		case "counselling":
			return "consultation";
		case "consultation":
		case "diagnostics":
		case "pharmacy":
		case "procedure":
		case "support":
		case "tele":
		case "ward":
			return category;
		default:
			return "support";
	}
}

export const create = scopedAuthMiddleware
	.input(FacilityCreateSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			// status (incl. maintenance-hold) is validated locally; the backend
			// create stores branch/category/code/name only.
			return await pm.run(tenantId, () =>
				pm.healthcare.facilities.create.run(
					{
						input: {
							branchId: input.branchId,
							category: toBackendCategory(input.category),
							code: input.code,
							name: input.name,
						},
					},
					{ actorId },
				),
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
				pm.healthcare.facilities.get.run(
					{ input: { id: input.id } },
					{ actorId },
				),
			);
		} catch (error) {
			throw new Error(
				`Facility lookup failed (${error instanceof Error ? error.message : "unknown error"}); check the ID and retry`,
			);
		}
	});

export const list = scopedAuthMiddleware
	.input(FacilityListSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.facilities.list.run(
					{ input: { branchId: input.branchId } },
					{ actorId },
				),
			);
		} catch (error) {
			throw new Error(
				`Facility list failed (${error instanceof Error ? error.message : "unknown error"}); retry`,
			);
		}
	});

export const update = scopedAuthMiddleware
	.input(FacilityPatchSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			// Strip client-only status; map extended categories for the backend.
			const { patch } = input;
			return await pm.run(tenantId, () =>
				pm.healthcare.facilities.update.run(
					{
						input: {
							id: input.id,
							patch: {
								...(patch.category !== undefined
									? { category: toBackendCategory(patch.category) }
									: {}),
								...(patch.code !== undefined ? { code: patch.code } : {}),
								...(patch.name !== undefined ? { name: patch.name } : {}),
							},
						},
					},
					{ actorId },
				),
			);
		} catch (error) {
			throw new Error(
				`Facility update failed (${error instanceof Error ? error.message : "unknown error"}); check the ID and retry`,
			);
		}
	});

export const setSchedule = scopedAuthMiddleware
	.input(FacilityScheduleSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.facilities.setSchedule.run(
					{
						input: {
							branchId: input.branchId,
							close: input.close,
							facilityId: input.facilityId,
							open: input.open,
							weekday: input.weekday,
						},
					},
					{ actorId },
				),
			);
		} catch (error) {
			throw new Error(
				`Facility schedule save failed (${error instanceof Error ? error.message : "unknown error"}); verify hours and retry`,
			);
		}
	});

export const addBlock = scopedAuthMiddleware
	.input(FacilityBlockSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.facilities.addBlock.run(
					{
						input: {
							branchId: input.branchId,
							facilityId: input.facilityId,
							from: input.from,
							reason: input.reason,
							to: input.to,
						},
					},
					{ actorId },
				),
			);
		} catch (error) {
			throw new Error(
				`Facility block failed (${error instanceof Error ? error.message : "unknown error"}); verify the range and retry`,
			);
		}
	});

export const overlap = scopedAuthMiddleware
	.input(FacilityBlockSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.facilities.overlap.run(
					{
						input: {
							branchId: input.branchId,
							facilityId: input.facilityId,
							from: input.from,
							to: input.to,
						},
					},
					{ actorId },
				),
			);
		} catch (error) {
			throw new Error(
				`Overlap check failed (${error instanceof Error ? error.message : "unknown error"}); verify the range and retry`,
			);
		}
	});

export const occupy = scopedAuthMiddleware
	.input(OccupySchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.facilities.occupy.run(
					{
						input: {
							branchId: input.branchId,
							facilityId: input.facilityId,
							note: input.note,
						},
					},
					{ actorId },
				),
			);
		} catch (error) {
			throw new Error(
				`Facility occupy failed (${error instanceof Error ? error.message : "unknown error"}); check occupancy and retry`,
			);
		}
	});

export const release = scopedAuthMiddleware
	.input(ReleaseSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.facilities.release.run(
					{
						input: {
							branchId: input.branchId,
							facilityId: input.facilityId,
							note: input.note,
						},
					},
					{ actorId },
				),
			);
		} catch (error) {
			throw new Error(
				`Facility release failed (${error instanceof Error ? error.message : "unknown error"}); check occupancy and retry`,
			);
		}
	});

export const logSterilization = scopedAuthMiddleware
	.input(SterilizationLogSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.facilities.logSterilization.run(
					{
						input: {
							at: input.at,
							branchId: input.branchId,
							by: input.by,
							facilityId: input.facilityId,
							item: input.item,
							method: input.method,
						},
					},
					{ actorId },
				),
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
				pm.healthcare.facilities.statusBoard.run(
					{ input: { branchId: input.branchId } },
					{ actorId },
				),
			);
		} catch (error) {
			throw new Error(
				`Status board failed (${error instanceof Error ? error.message : "unknown error"}); retry`,
			);
		}
	});
