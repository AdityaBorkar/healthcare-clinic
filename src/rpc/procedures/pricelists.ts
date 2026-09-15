import {
	BulkRevisionApplySchema,
	BulkRevisionPreviewSchema,
	PricelistCreateSchema,
	PricelistIdSchema,
	PricelistListSchema,
	PricelistPatchSchema,
	PricelistPublishSchema,
	PriceResolveSchema,
} from "#/schemas/services";
import { scopedAuthMiddleware } from "../middlewares/scoped_auth";

export const list = scopedAuthMiddleware
	.input(PricelistListSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.pricelists.list.run(
					{
						input: {
							branchId: input.branchId,
							...(input.payer ? { payer: input.payer } : {}),
							...(input.search ? { search: input.search } : {}),
							...(input.status ? { status: input.status } : {}),
						},
					},
					{ actorId },
				),
			);
		} catch (error) {
			throw new Error(
				`Pricelist list failed (${error instanceof Error ? error.message : "unknown error"}); retry`,
			);
		}
	});

export const get = scopedAuthMiddleware
	.input(PricelistIdSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.pricelists.get.run(
					{ input: { id: input.id } },
					{ actorId },
				),
			);
		} catch (error) {
			throw new Error(
				`Pricelist lookup failed (${error instanceof Error ? error.message : "unknown error"}); check the ID and retry`,
			);
		}
	});

export const create = scopedAuthMiddleware
	.input(PricelistCreateSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.pricelists.create.run(
					{
						input: {
							branchId: input.branchId,
							code: input.code,
							currency: input.currency ?? "INR",
							name: input.name,
							...(input.payer ? { payer: input.payer } : {}),
							scope: input.scope ?? "branch",
							taxInclusive: input.taxInclusive ?? true,
						},
					},
					{ actorId },
				),
			);
		} catch (error) {
			throw new Error(
				`Pricelist creation failed (${error instanceof Error ? error.message : "unknown error"}); verify the code and retry`,
			);
		}
	});

export const update = scopedAuthMiddleware
	.input(PricelistPatchSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			const { patch } = input;
			return await pm.run(tenantId, () =>
				pm.healthcare.pricelists.update.run(
					{
						input: {
							id: input.id,
							patch: {
								...(patch.currency ? { currency: patch.currency } : {}),
								...(patch.name ? { name: patch.name } : {}),
								...(patch.payer !== undefined ? { payer: patch.payer } : {}),
								...(patch.scope ? { scope: patch.scope } : {}),
								...(patch.taxInclusive !== undefined
									? { taxInclusive: patch.taxInclusive }
									: {}),
							},
						},
					},
					{ actorId },
				),
			);
		} catch (error) {
			throw new Error(
				`Pricelist update failed (${error instanceof Error ? error.message : "unknown error"}); check the ID and retry`,
			);
		}
	});

export const publish = scopedAuthMiddleware
	.input(PricelistPublishSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.pricelists.publish.run(
					{
						input: {
							id: input.id,
							...(input.effectiveFrom
								? { effectiveFrom: input.effectiveFrom }
								: {}),
							...(input.effectiveTo ? { effectiveTo: input.effectiveTo } : {}),
						},
					},
					{ actorId },
				),
			);
		} catch (error) {
			throw new Error(
				`Pricelist publish failed (${error instanceof Error ? error.message : "unknown error"}); resolve the blockers and retry`,
			);
		}
	});

export const retire = scopedAuthMiddleware
	.input(PricelistIdSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.pricelists.retire.run(
					{ input: { id: input.id } },
					{ actorId },
				),
			);
		} catch (error) {
			throw new Error(
				`Pricelist retire failed (${error instanceof Error ? error.message : "unknown error"}); check the ID and retry`,
			);
		}
	});

export const ensureDefault = scopedAuthMiddleware
	.input(PricelistListSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.pricelists.ensureDefault.run(
					{
						input: {
							branchId: input.branchId,
							currency: "INR",
							taxInclusive: true,
						},
					},
					{ actorId },
				),
			);
		} catch (error) {
			throw new Error(
				`Default pricelist setup failed (${error instanceof Error ? error.message : "unknown error"}); retry`,
			);
		}
	});

export const resolvePrice = scopedAuthMiddleware
	.input(PriceResolveSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.pricelists.resolvePrice.run(
					{
						input: {
							branchId: input.branchId,
							...(input.date ? { date: input.date } : {}),
							...(input.payer ? { payer: input.payer } : {}),
							...(input.pricelistId ? { pricelistId: input.pricelistId } : {}),
							serviceId: input.serviceId,
						},
					},
					{ actorId },
				),
			);
		} catch (error) {
			throw new Error(
				`Price resolution failed (${error instanceof Error ? error.message : "unknown error"}); add a rate on the pricelist or Default`,
			);
		}
	});

export const previewBulkRevision = scopedAuthMiddleware
	.input(BulkRevisionPreviewSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.pricelists.previewBulkRevision.run(
					{
						input: {
							branchId: input.branchId,
							pricelistId: input.pricelistId,
							...(input.rows ? { rows: input.rows } : {}),
							...(input.upliftPct !== undefined
								? { upliftPct: input.upliftPct }
								: {}),
						},
					},
					{ actorId },
				),
			);
		} catch (error) {
			throw new Error(
				`Bulk revision preview failed (${error instanceof Error ? error.message : "unknown error"}); verify the pricelist and retry`,
			);
		}
	});

export const applyBulkRevision = scopedAuthMiddleware
	.input(BulkRevisionApplySchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.pricelists.applyBulkRevision.run(
					{
						input: {
							approvedBy: input.approvedBy,
							branchId: input.branchId,
							effectiveFrom: input.effectiveFrom,
							pricelistId: input.pricelistId,
							requestedBy: input.requestedBy,
							...(input.rows ? { rows: input.rows } : {}),
							...(input.upliftPct !== undefined
								? { upliftPct: input.upliftPct }
								: {}),
						},
					},
					{ actorId },
				),
			);
		} catch (error) {
			throw new Error(
				`Bulk revision apply failed (${error instanceof Error ? error.message : "unknown error"}); verify maker-checker approval and retry`,
			);
		}
	});
