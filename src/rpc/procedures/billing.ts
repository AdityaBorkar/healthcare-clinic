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
import { scopedAuthMiddleware } from "../middlewares/scoped_auth";

export const invoiceRaise = scopedAuthMiddleware
	.input(InvoiceFromSourcesSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.billing.invoiceRaise.run({ input }, { actorId }),
		);
	});

export const invoiceFinalize = scopedAuthMiddleware
	.input(InvoiceFinalizeSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.billing.invoiceFinalize.run({ input }, { actorId }),
		);
	});

export const interimTab = scopedAuthMiddleware
	.input(InterimTabSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.billing.interimTab.run({ input }, { actorId }),
		);
	});

export const applyDiscount = scopedAuthMiddleware
	.input(DiscountSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.billing.applyDiscount.run({ input }, { actorId }),
		);
	});

export const collect = scopedAuthMiddleware
	.input(PaySchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.billing.collect.run({ input }, { actorId }),
		);
	});

export const settle = scopedAuthMiddleware
	.input(InterimTabSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.billing.settle.run({ input }, { actorId }),
		);
	});

export const packageSell = scopedAuthMiddleware
	.input(PackageSellSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.billing.packageSell.run({ input }, { actorId }),
		);
	});

export const packageRedeem = scopedAuthMiddleware
	.input(RedeemSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.billing.packageRedeem.run({ input }, { actorId }),
		);
	});

export const packageExpireRun = scopedAuthMiddleware
	.input(DuesAgingSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.billing.packageExpireRun.run({ input }, { actorId }),
		);
	});

export const pricelistUpsert = scopedAuthMiddleware
	.input(PricelistSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.billing.pricelistUpsert.run({ input }, { actorId }),
		);
	});

export const repriceOnPayerSwitch = scopedAuthMiddleware
	.input(RepriceSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.billing.repriceOnPayerSwitch.run({ input }, { actorId }),
		);
	});

export const cndnIssue = scopedAuthMiddleware
	.input(BillingCndnSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.billing.cndnIssue.run({ input }, { actorId }),
		);
	});

export const settleAdvance = scopedAuthMiddleware
	.input(SettleAdvanceSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.billing.settleAdvance.run({ input }, { actorId }),
		);
	});

export const duesAging = scopedAuthMiddleware
	.input(DuesAgingSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.billing.duesAging.run({ input }, { actorId }),
		);
	});

export const gstExport = scopedAuthMiddleware
	.input(GstExportSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.billing.gstExport.run({ input }, { actorId }),
		);
	});

export const getInvoice = scopedAuthMiddleware
	.input(BillingIdSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.billing.getInvoice.run({ input }, { actorId }),
		);
	});

export const collectionReport = scopedAuthMiddleware
	.input(CollectionReportSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.billing.collectionReport.run({ input }, { actorId }),
		);
	});

export const packageLiability = scopedAuthMiddleware
	.input(PackageLiabilitySchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.billing.packageLiability.run({ input }, { actorId }),
		);
	});
