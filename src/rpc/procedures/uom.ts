import {
	UomConvertSchema,
	UomCreateSchema,
	UomIdSchema,
	UomListSchema,
	UomPatchSchema,
	UomRetireSchema,
} from "#/schemas/uom";
import { scopedAuthMiddleware } from "../middlewares/scoped_auth";

export const list = scopedAuthMiddleware
	.input(UomListSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.masters.unitsOfMeasure.list.run(
					{
						filters: {
							...(input.category ? { category: input.category } : {}),
							...(input.isActive !== undefined
								? { isActive: input.isActive }
								: {}),
							...(input.status ? { status: input.status } : {}),
							...(input.search ? { search: input.search } : {}),
						},
						...(input.limit !== undefined ? { limit: input.limit } : {}),
						...(input.offset !== undefined ? { offset: input.offset } : {}),
					},
					{ actorId },
				),
			);
		} catch (error) {
			throw new Error(
				`UOM list failed (${error instanceof Error ? error.message : "unknown error"}); retry`,
			);
		}
	});

export const get = scopedAuthMiddleware
	.input(UomIdSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.masters.unitsOfMeasure.get.run({ id: input.id }, { actorId }),
			);
		} catch (error) {
			throw new Error(
				`UOM lookup failed (${error instanceof Error ? error.message : "unknown error"}); check the ID and retry`,
			);
		}
	});

export const create = scopedAuthMiddleware
	.input(UomCreateSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.masters.unitsOfMeasure.create.run(
					{
						input: {
							...(input.baseUnitId ? { baseUnitId: input.baseUnitId } : {}),
							category: input.category,
							code: input.code,
							...(input.conversionFactor !== undefined
								? { conversionFactor: input.conversionFactor }
								: {}),
							decimalPlaces: input.decimalPlaces ?? 2,
							isActive: true,
							isBaseUnit: input.isBaseUnit ?? false,
							isDefault: input.isDefault ?? false,
							isIndivisible: input.isIndivisible ?? false,
							...(input.isBaseUnit !== undefined
								? { isBaseUnit: input.isBaseUnit }
								: {}),
							...(input.isDefault !== undefined
								? { isDefault: input.isDefault }
								: {}),
							...(input.isIndivisible !== undefined
								? { isIndivisible: input.isIndivisible }
								: {}),
							name: input.name,
							...(input.symbol ? { symbol: input.symbol } : {}),
						},
					},
					{ actorId },
				),
			);
		} catch (error) {
			throw new Error(
				`UOM creation failed (${error instanceof Error ? error.message : "unknown error"}); verify the code and retry`,
			);
		}
	});

export const update = scopedAuthMiddleware
	.input(UomPatchSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			const { patch } = input;
			return await pm.run(tenantId, () =>
				pm.masters.unitsOfMeasure.update.run(
					{
						id: input.id,
						patch: {
							...(patch.baseUnitId !== undefined
								? { baseUnitId: patch.baseUnitId }
								: {}),
							...(patch.category ? { category: patch.category } : {}),
							...(patch.code ? { code: patch.code } : {}),
							...(patch.conversionFactor !== undefined
								? { conversionFactor: patch.conversionFactor }
								: {}),
							...(patch.decimalPlaces !== undefined
								? { decimalPlaces: patch.decimalPlaces }
								: {}),
							...(patch.factorChangeReason
								? { factorChangeReason: patch.factorChangeReason }
								: {}),
							...(patch.isActive !== undefined
								? { isActive: patch.isActive }
								: {}),
							...(patch.isBaseUnit !== undefined
								? { isBaseUnit: patch.isBaseUnit }
								: {}),
							...(patch.isDefault !== undefined
								? { isDefault: patch.isDefault }
								: {}),
							...(patch.isIndivisible !== undefined
								? { isIndivisible: patch.isIndivisible }
								: {}),
							...(patch.name ? { name: patch.name } : {}),
							...(patch.symbol !== undefined ? { symbol: patch.symbol } : {}),
						},
					},
					{ actorId },
				),
			);
		} catch (error) {
			throw new Error(
				`UOM update failed (${error instanceof Error ? error.message : "unknown error"}); check the ID and retry`,
			);
		}
	});

export const publish = scopedAuthMiddleware
	.input(UomIdSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.masters.unitsOfMeasure.publish.run({ id: input.id }, { actorId }),
			);
		} catch (error) {
			throw new Error(
				`UOM publish failed (${error instanceof Error ? error.message : "unknown error"}); resolve the blockers and retry`,
			);
		}
	});

export const retire = scopedAuthMiddleware
	.input(UomRetireSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.masters.unitsOfMeasure.retire.run(
					{
						input: {
							id: input.id,
							...(input.reason ? { reason: input.reason } : {}),
						},
					},
					{ actorId },
				),
			);
		} catch (error) {
			throw new Error(
				`UOM retire failed (${error instanceof Error ? error.message : "unknown error"}); check the ID and retry`,
			);
		}
	});

export const setDefault = scopedAuthMiddleware
	.input(UomIdSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.masters.unitsOfMeasure.setDefault.run(
					{ input: { id: input.id } },
					{ actorId },
				),
			);
		} catch (error) {
			throw new Error(
				`UOM default assignment failed (${error instanceof Error ? error.message : "unknown error"}); check the ID and retry`,
			);
		}
	});

export const convert = scopedAuthMiddleware
	.input(UomConvertSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.masters.unitsOfMeasure.convert.run(
					{
						input: {
							fromUomId: input.fromUomId,
							quantity: input.quantity,
							...(input.toUomId ? { toUomId: input.toUomId } : {}),
						},
					},
					{ actorId },
				),
			);
		} catch (error) {
			throw new Error(
				`UOM conversion failed (${error instanceof Error ? error.message : "unknown error"}); verify the units share a category`,
			);
		}
	});

export const seed = scopedAuthMiddleware
	.input(UomListSchema)
	.handler(async ({ context }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.masters.unitsOfMeasure.seed.run({}, { actorId }),
			);
		} catch (error) {
			throw new Error(
				`UOM seed failed (${error instanceof Error ? error.message : "unknown error"}); retry`,
			);
		}
	});

export const versions = scopedAuthMiddleware
	.input(UomIdSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.masters.unitsOfMeasure.versions.run({ id: input.id }, { actorId }),
			);
		} catch (error) {
			throw new Error(
				`UOM history lookup failed (${error instanceof Error ? error.message : "unknown error"}); check the ID and retry`,
			);
		}
	});
