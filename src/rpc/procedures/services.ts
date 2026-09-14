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
import { authed } from "../middlewares/auth";
import { requireOrganizationSlug } from "../utils/subdomain";
import { resolveTenantDatabaseName } from "../utils/workspace-organization";

export const create = authed
	.input(ServiceCreateSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		try {
			// Backend create accepts basePrice/branchId/code/name/teleExempt
			// only; department/pathy/modality/duration/payer/GST/billing-code
			// are validated locally and kept client-side until backend grows.
			// Dup-block (P1): callers check list(search=code) before create.
			return await pm.run(dbName, () =>
				pm.healthcare.services.create.run(
					{
						input: {
							basePrice: input.basePrice,
							branchId: input.branchId,
							code: input.code,
							name: input.name,
							teleExempt: input.teleExempt,
						},
					},
					{ actorId: context.session.user.id },
				),
			);
		} catch (error) {
			throw new Error(
				`Service creation failed (${error instanceof Error ? error.message : "unknown error"}); verify the code and retry`,
			);
		}
	});

export const get = authed
	.input(ServiceIdSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		try {
			return await pm.run(dbName, () =>
				pm.healthcare.services.get.run(
					{ input: { id: input.id } },
					{ actorId: context.session.user.id },
				),
			);
		} catch (error) {
			throw new Error(
				`Service lookup failed (${error instanceof Error ? error.message : "unknown error"}); check the ID and retry`,
			);
		}
	});

export const list = authed
	.input(ServiceListSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		try {
			// Backend list accepts branchId only; department/pathy/search are
			// applied as client-side type-ahead until backend filters land.
			return await pm.run(dbName, () =>
				pm.healthcare.services.list.run(
					{ input: { branchId: input.branchId } },
					{ actorId: context.session.user.id },
				),
			);
		} catch (error) {
			throw new Error(
				`Service list failed (${error instanceof Error ? error.message : "unknown error"}); retry`,
			);
		}
	});

export const update = authed
	.input(ServicePatchSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		try {
			// Strip client-only patch keys before the backend update call.
			const { patch } = input;
			return await pm.run(dbName, () =>
				pm.healthcare.services.update.run(
					{
						input: {
							id: input.id,
							patch: {
								...(patch.basePrice !== undefined
									? { basePrice: patch.basePrice }
									: {}),
								...(patch.name !== undefined ? { name: patch.name } : {}),
								...(patch.teleExempt !== undefined
									? { teleExempt: patch.teleExempt }
									: {}),
							},
						},
					},
					{ actorId: context.session.user.id },
				),
			);
		} catch (error) {
			throw new Error(
				`Service update failed (${error instanceof Error ? error.message : "unknown error"}); check the ID and retry`,
			);
		}
	});

export const publish = authed
	.input(ServiceIdSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		try {
			return await pm.run(dbName, () =>
				pm.healthcare.services.publish.run(
					{ input: { id: input.id } },
					{ actorId: context.session.user.id },
				),
			);
		} catch (error) {
			throw new Error(
				`Service publish failed (${error instanceof Error ? error.message : "unknown error"}); check the ID and retry`,
			);
		}
	});

export const retire = authed
	.input(ServiceIdSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		try {
			return await pm.run(dbName, () =>
				pm.healthcare.services.retire.run(
					{ input: { id: input.id } },
					{ actorId: context.session.user.id },
				),
			);
		} catch (error) {
			throw new Error(
				`Service retire failed (${error instanceof Error ? error.message : "unknown error"}); check the ID and retry`,
			);
		}
	});

export const mapFacilities = authed
	.input(FacilityMapSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		try {
			return await pm.run(dbName, () =>
				pm.healthcare.services.mapFacilities.run(
					{
						input: {
							branchId: input.branchId,
							facilityId: input.facilityId,
							serviceId: input.serviceId,
						},
					},
					{ actorId: context.session.user.id },
				),
			);
		} catch (error) {
			throw new Error(
				`Facility mapping failed (${error instanceof Error ? error.message : "unknown error"}); verify both IDs and retry`,
			);
		}
	});

export const setPrice = authed
	.input(PriceSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		try {
			return await pm.run(dbName, () =>
				pm.healthcare.services.setPrice.run(
					{
						input: {
							amount: input.amount,
							branchId: input.branchId,
							effectiveFrom: input.effectiveFrom,
							pricelist: input.pricelist,
							serviceId: input.serviceId,
						},
					},
					{ actorId: context.session.user.id },
				),
			);
		} catch (error) {
			throw new Error(
				`Price save failed (${error instanceof Error ? error.message : "unknown error"}); verify the amount and retry`,
			);
		}
	});

export const addDiscountRule = authed
	.input(DiscountRuleSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		try {
			// maxPct/approver are validated locally as the discount note
			// (max-% + approver) until the backend stores them.
			return await pm.run(dbName, () =>
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
					{ actorId: context.session.user.id },
				),
			);
		} catch (error) {
			throw new Error(
				`Discount rule save failed (${error instanceof Error ? error.message : "unknown error"}); verify the percent and retry`,
			);
		}
	});

export const definePackage = authed
	.input(PackageDefSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		try {
			// sessions/validityDays/scope are validated locally as the package
			// note (sessions/validity/scope) until the backend stores them.
			return await pm.run(dbName, () =>
				pm.healthcare.services.definePackage.run(
					{
						input: {
							branchId: input.branchId,
							name: input.name,
							price: input.price,
							serviceIds: input.serviceIds,
						},
					},
					{ actorId: context.session.user.id },
				),
			);
		} catch (error) {
			throw new Error(
				`Package save failed (${error instanceof Error ? error.message : "unknown error"}); verify services and retry`,
			);
		}
	});

export const redeem = authed
	.input(RedeemSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		try {
			return await pm.run(dbName, () =>
				pm.healthcare.services.redeem.run(
					{
						input: {
							branchId: input.branchId,
							packageId: input.packageId,
							patientId: input.patientId,
						},
					},
					{ actorId: context.session.user.id },
				),
			);
		} catch (error) {
			throw new Error(
				`Package redemption failed (${error instanceof Error ? error.message : "unknown error"}); verify the package and retry`,
			);
		}
	});
