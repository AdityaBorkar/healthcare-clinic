import {
	ConvertQuantitySchema,
	CreateUnitOfMeasureSchema,
	IdSchema,
	ListUnitsOfMeasureSchema,
	RetireUnitOfMeasureSchema,
	SetDefaultUnitOfMeasureSchema,
	UpdateUnitOfMeasureSchema,
	WithIdSchema,
} from "@aspen-os/masters";
import { object } from "valibot";

import { scopedAuthMiddleware } from "../middlewares/scoped_auth";

const UomUpdateSchema = object({
	id: IdSchema,
	patch: UpdateUnitOfMeasureSchema,
});

export const list = scopedAuthMiddleware
	.input(ListUnitsOfMeasureSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.masters.unitsOfMeasure.list.run(input, { actorId }),
			);
		} catch (error) {
			throw new Error(
				`UOM list failed (${error instanceof Error ? error.message : "unknown error"}); retry`,
			);
		}
	});

export const get = scopedAuthMiddleware
	.input(WithIdSchema)
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
	.input(CreateUnitOfMeasureSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.masters.unitsOfMeasure.create.run({ input }, { actorId }),
			);
		} catch (error) {
			throw new Error(
				`UOM creation failed (${error instanceof Error ? error.message : "unknown error"}); verify the code and retry`,
			);
		}
	});

export const update = scopedAuthMiddleware
	.input(UomUpdateSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.masters.unitsOfMeasure.update.run(
					{ id: input.id, patch: input.patch },
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
	.input(WithIdSchema)
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
	.input(RetireUnitOfMeasureSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.masters.unitsOfMeasure.retire.run({ input }, { actorId }),
			);
		} catch (error) {
			throw new Error(
				`UOM retire failed (${error instanceof Error ? error.message : "unknown error"}); check the ID and retry`,
			);
		}
	});

export const setDefault = scopedAuthMiddleware
	.input(SetDefaultUnitOfMeasureSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.masters.unitsOfMeasure.setDefault.run({ input }, { actorId }),
			);
		} catch (error) {
			throw new Error(
				`UOM default assignment failed (${error instanceof Error ? error.message : "unknown error"}); check the ID and retry`,
			);
		}
	});

export const convert = scopedAuthMiddleware
	.input(ConvertQuantitySchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.masters.unitsOfMeasure.convert.run({ input }, { actorId }),
			);
		} catch (error) {
			throw new Error(
				`UOM conversion failed (${error instanceof Error ? error.message : "unknown error"}); verify the units share a category`,
			);
		}
	});

export const seed = scopedAuthMiddleware.handler(async ({ context }) => {
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
	.input(WithIdSchema)
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
