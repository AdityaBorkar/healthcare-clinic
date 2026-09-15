import {
	ApplyBulkRevisionSchema,
	CreatePricelistSchema,
	EnsureDefaultPricelistSchema,
	PreviewBulkRevisionSchema,
	PricelistFiltersSchema,
	PricelistIdSchema,
	PublishPricelistSchema,
	ResolvePriceSchema,
	UpdatePricelistSchema,
} from "@aspen-os/healthcare";

import { scopedAuthMiddleware } from "../middlewares/scoped_auth";

export const list = scopedAuthMiddleware
	.input(PricelistFiltersSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.pricelists.list.run({ input }, { actorId }),
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
				pm.healthcare.pricelists.get.run({ input }, { actorId }),
			);
		} catch (error) {
			throw new Error(
				`Pricelist lookup failed (${error instanceof Error ? error.message : "unknown error"}); check the ID and retry`,
			);
		}
	});

export const create = scopedAuthMiddleware
	.input(CreatePricelistSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.pricelists.create.run({ input }, { actorId }),
			);
		} catch (error) {
			throw new Error(
				`Pricelist creation failed (${error instanceof Error ? error.message : "unknown error"}); verify the code and retry`,
			);
		}
	});

export const update = scopedAuthMiddleware
	.input(UpdatePricelistSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.pricelists.update.run({ input }, { actorId }),
			);
		} catch (error) {
			throw new Error(
				`Pricelist update failed (${error instanceof Error ? error.message : "unknown error"}); check the ID and retry`,
			);
		}
	});

export const publish = scopedAuthMiddleware
	.input(PublishPricelistSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.pricelists.publish.run({ input }, { actorId }),
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
				pm.healthcare.pricelists.retire.run({ input }, { actorId }),
			);
		} catch (error) {
			throw new Error(
				`Pricelist retire failed (${error instanceof Error ? error.message : "unknown error"}); check the ID and retry`,
			);
		}
	});

export const ensureDefault = scopedAuthMiddleware
	.input(EnsureDefaultPricelistSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.pricelists.ensureDefault.run({ input }, { actorId }),
			);
		} catch (error) {
			throw new Error(
				`Default pricelist setup failed (${error instanceof Error ? error.message : "unknown error"}); retry`,
			);
		}
	});

export const resolvePrice = scopedAuthMiddleware
	.input(ResolvePriceSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.pricelists.resolvePrice.run({ input }, { actorId }),
			);
		} catch (error) {
			throw new Error(
				`Price resolution failed (${error instanceof Error ? error.message : "unknown error"}); add a rate on the pricelist or Default`,
			);
		}
	});

export const previewBulkRevision = scopedAuthMiddleware
	.input(PreviewBulkRevisionSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.pricelists.previewBulkRevision.run(
					{ input },
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
	.input(ApplyBulkRevisionSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.pricelists.applyBulkRevision.run({ input }, { actorId }),
			);
		} catch (error) {
			throw new Error(
				`Bulk revision apply failed (${error instanceof Error ? error.message : "unknown error"}); verify maker-checker approval and retry`,
			);
		}
	});
