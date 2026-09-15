import {
	CreateDiscountRuleSchema,
	CreateServiceSchema,
	DefinePackageSchema,
	MapFacilitiesSchema,
	RedeemPackageSchema,
	ServiceFiltersSchema,
	ServiceIdSchema,
	SetPriceSchema,
	UpdateServiceSchema,
} from "@aspen-os/healthcare";

import { scopedAuthMiddleware } from "../middlewares/scoped_auth";

// Every invoice must carry >= 1 billing code (CPT/ICD-11/internal).
export const INVOICE_MIN_CODES_NOTE =
	"Every invoice must carry at least one billing code (CPT/ICD-11/internal).";

export const create = scopedAuthMiddleware
	.input(CreateServiceSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			// Dup-block (P1): callers check list(search=code) before create.
			return await pm.run(tenantId, () =>
				pm.healthcare.services.create.run({ input }, { actorId }),
			);
		} catch (error) {
			throw new Error(
				`Service creation failed (${error instanceof Error ? error.message : "unknown error"}); verify the code and retry`,
			);
		}
	});

export const get = scopedAuthMiddleware
	.input(ServiceIdSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.services.get.run({ input }, { actorId }),
			);
		} catch (error) {
			throw new Error(
				`Service lookup failed (${error instanceof Error ? error.message : "unknown error"}); check the ID and retry`,
			);
		}
	});

export const list = scopedAuthMiddleware
	.input(ServiceFiltersSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.services.list.run({ input }, { actorId }),
			);
		} catch (error) {
			throw new Error(
				`Service list failed (${error instanceof Error ? error.message : "unknown error"}); retry`,
			);
		}
	});

export const update = scopedAuthMiddleware
	.input(UpdateServiceSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.services.update.run({ input }, { actorId }),
			);
		} catch (error) {
			throw new Error(
				`Service update failed (${error instanceof Error ? error.message : "unknown error"}); check the ID and retry`,
			);
		}
	});

export const publish = scopedAuthMiddleware
	.input(ServiceIdSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.services.publish.run({ input }, { actorId }),
			);
		} catch (error) {
			throw new Error(
				`Service publish failed (${error instanceof Error ? error.message : "unknown error"}); check the ID and retry`,
			);
		}
	});

export const retire = scopedAuthMiddleware
	.input(ServiceIdSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.services.retire.run({ input }, { actorId }),
			);
		} catch (error) {
			throw new Error(
				`Service retire failed (${error instanceof Error ? error.message : "unknown error"}); check the ID and retry`,
			);
		}
	});

export const mapFacilities = scopedAuthMiddleware
	.input(MapFacilitiesSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.services.mapFacilities.run({ input }, { actorId }),
			);
		} catch (error) {
			throw new Error(
				`Facility mapping failed (${error instanceof Error ? error.message : "unknown error"}); verify both IDs and retry`,
			);
		}
	});

export const setPrice = scopedAuthMiddleware
	.input(SetPriceSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.services.setPrice.run({ input }, { actorId }),
			);
		} catch (error) {
			throw new Error(
				`Price save failed (${error instanceof Error ? error.message : "unknown error"}); verify the amount and retry`,
			);
		}
	});

export const addDiscountRule = scopedAuthMiddleware
	.input(CreateDiscountRuleSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.services.addDiscountRule.run({ input }, { actorId }),
			);
		} catch (error) {
			throw new Error(
				`Discount rule save failed (${error instanceof Error ? error.message : "unknown error"}); verify the percent and retry`,
			);
		}
	});

export const definePackage = scopedAuthMiddleware
	.input(DefinePackageSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.services.definePackage.run({ input }, { actorId }),
			);
		} catch (error) {
			throw new Error(
				`Package save failed (${error instanceof Error ? error.message : "unknown error"}); verify services and retry`,
			);
		}
	});

export const redeem = scopedAuthMiddleware
	.input(RedeemPackageSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.services.redeem.run({ input }, { actorId }),
			);
		} catch (error) {
			throw new Error(
				`Package redemption failed (${error instanceof Error ? error.message : "unknown error"}); verify the package and retry`,
			);
		}
	});
