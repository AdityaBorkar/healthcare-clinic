import {
	ApplyDiscountSchema,
	BillingCreatePricelistSchema,
	BillingRedeemPackageSchema,
	CollectionReportSchema,
	CollectPaymentSchema,
	CreateInvoiceSchema,
	CreatePackageBalanceSchema,
	DuesAgingFiltersSchema,
	FinalizeInvoiceSchema,
	GstExportFiltersSchema,
	InvoiceIdSchema,
	IssueCndnSchema,
	PackageLiabilitySchema,
	RepriceInvoiceSchema,
	SettleAdvanceSchema,
	SettleTabSchema,
} from "@aspen-os/healthcare";

import { scopedAuthMiddleware } from "../middlewares/scoped_auth";

export const invoiceRaise = scopedAuthMiddleware
	.input(CreateInvoiceSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.billing.invoiceRaise.run({ input }, { actorId }),
		);
	});

export const invoiceFinalize = scopedAuthMiddleware
	.input(FinalizeInvoiceSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.billing.invoiceFinalize.run({ input }, { actorId }),
		);
	});

export const interimTab = scopedAuthMiddleware
	.input(SettleTabSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.billing.interimTab.run({ input }, { actorId }),
		);
	});

export const applyDiscount = scopedAuthMiddleware
	.input(ApplyDiscountSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.billing.applyDiscount.run({ input }, { actorId }),
		);
	});

export const collect = scopedAuthMiddleware
	.input(CollectPaymentSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.billing.collect.run({ input }, { actorId }),
		);
	});

export const settle = scopedAuthMiddleware
	.input(SettleTabSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.billing.settle.run({ input }, { actorId }),
		);
	});

export const packageSell = scopedAuthMiddleware
	.input(CreatePackageBalanceSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.billing.packageSell.run({ input }, { actorId }),
		);
	});

export const packageRedeem = scopedAuthMiddleware
	.input(BillingRedeemPackageSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.billing.packageRedeem.run({ input }, { actorId }),
		);
	});

export const packageExpireRun = scopedAuthMiddleware
	.input(DuesAgingFiltersSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.billing.packageExpireRun.run({ input }, { actorId }),
		);
	});

export const pricelistUpsert = scopedAuthMiddleware
	.input(BillingCreatePricelistSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.billing.pricelistUpsert.run({ input }, { actorId }),
		);
	});

export const repriceOnPayerSwitch = scopedAuthMiddleware
	.input(RepriceInvoiceSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.billing.repriceOnPayerSwitch.run({ input }, { actorId }),
		);
	});

export const cndnIssue = scopedAuthMiddleware
	.input(IssueCndnSchema)
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
	.input(DuesAgingFiltersSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.billing.duesAging.run({ input }, { actorId }),
		);
	});

export const gstExport = scopedAuthMiddleware
	.input(GstExportFiltersSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.billing.gstExport.run({ input }, { actorId }),
		);
	});

export const getInvoice = scopedAuthMiddleware
	.input(InvoiceIdSchema)
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
