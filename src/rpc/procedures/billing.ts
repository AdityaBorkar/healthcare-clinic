import {
	BillingCndnSchema,
	BillingIdSchema,
	DiscountSchema,
	DuesAgingSchema,
	GstExportSchema,
	InterimTabSchema,
	InvoiceFinalizeSchema,
	InvoiceFromSourcesSchema,
	PackageSellSchema,
	PaySchema,
	PricelistSchema,
	RedeemSchema,
	RepriceSchema,
	SettleAdvanceSchema,
} from "#/schemas/billing";
import { authed } from "../middlewares/auth";
import { requireOrganizationSlug } from "../utils/subdomain";
import { resolveTenantDatabaseName } from "../utils/workspace-organization";

export const invoiceRaise = authed
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

export const invoiceFinalize = authed
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

export const interimTab = authed
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

export const applyDiscount = authed
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

export const collect = authed
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

export const settle = authed
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

export const packageSell = authed
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

export const packageRedeem = authed
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

export const packageExpireRun = authed
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

export const pricelistUpsert = authed
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

export const repriceOnPayerSwitch = authed
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

export const cndnIssue = authed
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

export const settleAdvance = authed
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

export const duesAging = authed
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

export const gstExport = authed
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

export const getInvoice = authed
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
