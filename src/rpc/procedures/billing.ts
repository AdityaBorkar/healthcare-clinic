import {
	BillingCndnSchema,
	BillingIdSchema,
	CollectionReportSchema,
	DiscountSchema,
	DuesAgingSchema,
	GstExportSchema,
	InterimTabSchema,
	InvoiceFinalizeSchema,
	InvoiceFromSourcesSchema,
	PackageLiabilitySchema,
	PackageSellSchema,
	PaySchema,
	PricelistSchema,
	RedeemSchema,
	RepriceSchema,
	SettleAdvanceSchema,
} from "#/schemas/billing";
import { authMiddleware } from "../middlewares/auth";
import { requireOrganizationSlug } from "../utils/subdomain";
import { resolveTenantDatabaseName } from "../utils/workspace-organization";

export const invoiceRaise = authMiddleware
	.input(InvoiceFromSourcesSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.billing.invoiceRaise.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const invoiceFinalize = authMiddleware
	.input(InvoiceFinalizeSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.billing.invoiceFinalize.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const interimTab = authMiddleware
	.input(InterimTabSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.billing.interimTab.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const applyDiscount = authMiddleware
	.input(DiscountSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.billing.applyDiscount.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const collect = authMiddleware
	.input(PaySchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.billing.collect.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const settle = authMiddleware
	.input(InterimTabSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.billing.settle.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const packageSell = authMiddleware
	.input(PackageSellSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.billing.packageSell.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const packageRedeem = authMiddleware
	.input(RedeemSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.billing.packageRedeem.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const packageExpireRun = authMiddleware
	.input(DuesAgingSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.billing.packageExpireRun.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const pricelistUpsert = authMiddleware
	.input(PricelistSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.billing.pricelistUpsert.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const repriceOnPayerSwitch = authMiddleware
	.input(RepriceSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.billing.repriceOnPayerSwitch.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const cndnIssue = authMiddleware
	.input(BillingCndnSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.billing.cndnIssue.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const settleAdvance = authMiddleware
	.input(SettleAdvanceSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.billing.settleAdvance.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const duesAging = authMiddleware
	.input(DuesAgingSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.billing.duesAging.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const gstExport = authMiddleware
	.input(GstExportSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.billing.gstExport.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const getInvoice = authMiddleware
	.input(BillingIdSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.billing.getInvoice.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const collectionReport = authMiddleware
	.input(CollectionReportSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.billing.collectionReport.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const packageLiability = authMiddleware
	.input(PackageLiabilitySchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.billing.packageLiability.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});
