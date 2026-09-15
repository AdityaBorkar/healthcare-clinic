import {
	DiscountRuleSchema,
	FacilityMapSchema,
	PackageDefSchema,
	PriceSchema,
	RedeemSchema,
	ServiceCreateSchema,
	ServiceIdSchema,
	ServiceListSchema,
	ServicePatchSchema,
} from "#/schemas/services";
import { scopedAuthMiddleware } from "../middlewares/scoped_auth";

export const create = scopedAuthMiddleware
	.input(ServiceCreateSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			// Backend create accepts basePrice/branchId/code/name/teleExempt
			// plus department/pathy/modality/UOM bindings; payer/GST/billing-code
			// are validated locally and kept client-side until backend grows.
			// Dup-block (P1): callers check list(search=code) before create.
			return await pm.run(tenantId, () =>
				pm.healthcare.services.create.run(
					{
						input: {
							basePrice: input.basePrice,
							...(input.billingUomCategory
								? { billingUomCategory: input.billingUomCategory }
								: {}),
							...(input.billingUomId
								? { billingUomId: input.billingUomId }
								: {}),
							branchId: input.branchId,
							code: input.code,
							...(input.department ? { department: input.department } : {}),
							...(input.durationMin !== undefined
								? {
										durationUomCategory: "time",
										durationValue: input.durationMin,
									}
								: {}),
							...(input.durationUomCategory
								? { durationUomCategory: input.durationUomCategory }
								: {}),
							...(input.durationUomId
								? { durationUomId: input.durationUomId }
								: {}),
							...(input.durationValue !== undefined
								? { durationValue: input.durationValue }
								: {}),
							...(input.modality ? { modality: input.modality } : {}),
							name: input.name,
							...(input.pathy ? { pathy: input.pathy } : {}),
							teleExempt: input.teleExempt,
						},
					},
					{ actorId },
				),
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
				pm.healthcare.services.get.run(
					{ input: { id: input.id } },
					{ actorId },
				),
			);
		} catch (error) {
			throw new Error(
				`Service lookup failed (${error instanceof Error ? error.message : "unknown error"}); check the ID and retry`,
			);
		}
	});

export const list = scopedAuthMiddleware
	.input(ServiceListSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.services.list.run(
					{
						input: {
							branchId: input.branchId,
							...(input.department ? { department: input.department } : {}),
							...(input.pathy ? { pathy: input.pathy } : {}),
							...(input.search ? { search: input.search } : {}),
							...(input.status ? { status: input.status } : {}),
						},
					},
					{ actorId },
				),
			);
		} catch (error) {
			throw new Error(
				`Service list failed (${error instanceof Error ? error.message : "unknown error"}); retry`,
			);
		}
	});

export const update = scopedAuthMiddleware
	.input(ServicePatchSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			const { patch } = input;
			return await pm.run(tenantId, () =>
				pm.healthcare.services.update.run(
					{
						input: {
							id: input.id,
							patch: {
								...(patch.basePrice !== undefined
									? { basePrice: patch.basePrice }
									: {}),
								...(patch.billingUomCategory !== undefined
									? { billingUomCategory: patch.billingUomCategory }
									: {}),
								...(patch.billingUomId !== undefined
									? { billingUomId: patch.billingUomId }
									: {}),
								...(patch.department !== undefined
									? { department: patch.department }
									: {}),
								...(patch.durationMin !== undefined
									? {
											durationUomCategory: "time",
											durationValue: patch.durationMin,
										}
									: {}),
								...(patch.durationUomCategory !== undefined
									? { durationUomCategory: patch.durationUomCategory }
									: {}),
								...(patch.durationUomId !== undefined
									? { durationUomId: patch.durationUomId }
									: {}),
								...(patch.durationValue !== undefined
									? { durationValue: patch.durationValue }
									: {}),
								...(patch.modality !== undefined
									? { modality: patch.modality }
									: {}),
								...(patch.name !== undefined ? { name: patch.name } : {}),
								...(patch.pathy !== undefined ? { pathy: patch.pathy } : {}),
								...(patch.teleExempt !== undefined
									? { teleExempt: patch.teleExempt }
									: {}),
							},
						},
					},
					{ actorId },
				),
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
				pm.healthcare.services.publish.run(
					{ input: { id: input.id } },
					{ actorId },
				),
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
				pm.healthcare.services.retire.run(
					{ input: { id: input.id } },
					{ actorId },
				),
			);
		} catch (error) {
			throw new Error(
				`Service retire failed (${error instanceof Error ? error.message : "unknown error"}); check the ID and retry`,
			);
		}
	});

export const mapFacilities = scopedAuthMiddleware
	.input(FacilityMapSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.services.mapFacilities.run(
					{
						input: {
							branchId: input.branchId,
							facilityId: input.facilityId,
							serviceId: input.serviceId,
						},
					},
					{ actorId },
				),
			);
		} catch (error) {
			throw new Error(
				`Facility mapping failed (${error instanceof Error ? error.message : "unknown error"}); verify both IDs and retry`,
			);
		}
	});

export const setPrice = scopedAuthMiddleware
	.input(PriceSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.services.setPrice.run(
					{
						input: {
							amount: input.amount,
							branchId: input.branchId,
							effectiveFrom: input.effectiveFrom,
							...(input.gstPct !== undefined ? { gstPct: input.gstPct } : {}),
							pricelist: input.pricelist,
							...(input.pricelistId ? { pricelistId: input.pricelistId } : {}),
							serviceId: input.serviceId,
						},
					},
					{ actorId },
				),
			);
		} catch (error) {
			throw new Error(
				`Price save failed (${error instanceof Error ? error.message : "unknown error"}); verify the amount and retry`,
			);
		}
	});

export const addDiscountRule = scopedAuthMiddleware
	.input(DiscountRuleSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			// maxPct/approver are validated locally as the discount note
			// (max-% + approver) until the backend stores them.
			return await pm.run(tenantId, () =>
				pm.healthcare.services.addDiscountRule.run(
					{
						input: {
							branchId: input.branchId,
							code: input.code,
							minQty: input.minQty,
							pct: input.pct,
							serviceId: input.serviceId,
						},
					},
					{ actorId },
				),
			);
		} catch (error) {
			throw new Error(
				`Discount rule save failed (${error instanceof Error ? error.message : "unknown error"}); verify the percent and retry`,
			);
		}
	});

export const definePackage = scopedAuthMiddleware
	.input(PackageDefSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			// sessions/validityDays/scope are validated locally as the package
			// note (sessions/validity/scope) until the backend stores them.
			return await pm.run(tenantId, () =>
				pm.healthcare.services.definePackage.run(
					{
						input: {
							branchId: input.branchId,
							name: input.name,
							price: input.price,
							serviceIds: input.serviceIds,
						},
					},
					{ actorId },
				),
			);
		} catch (error) {
			throw new Error(
				`Package save failed (${error instanceof Error ? error.message : "unknown error"}); verify services and retry`,
			);
		}
	});

export const redeem = scopedAuthMiddleware
	.input(RedeemSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		try {
			return await pm.run(tenantId, () =>
				pm.healthcare.services.redeem.run(
					{
						input: {
							branchId: input.branchId,
							packageId: input.packageId,
							patientId: input.patientId,
						},
					},
					{ actorId },
				),
			);
		} catch (error) {
			throw new Error(
				`Package redemption failed (${error instanceof Error ? error.message : "unknown error"}); verify the package and retry`,
			);
		}
	});
