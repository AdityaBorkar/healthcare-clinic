import {
	BatchReceiveSchema,
	ExpiryAlertQuerySchema,
	GrnVerifySchema,
	ItemUpsertSchema,
	PartialCloseSchema,
	PharmacyCndnSchema,
	PharmacyIdSchema,
	PiBookSchema,
	PoCreateSchema,
	ReorderSuggestSchema,
	ReturnSchema,
	SaleFromRxSchema,
	StockCorrectSchema,
	StockLedgerQuerySchema,
	TransferAcceptSchema,
	TransferSchema,
} from "#/schemas/pharmacy";
import { scopedAuthMiddleware } from "../middlewares/scoped_auth";

export const itemUpsert = scopedAuthMiddleware
	.input(ItemUpsertSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.pharmacy.itemUpsert.run({ input }, { actorId }),
		);
	});

export const batchReceive = scopedAuthMiddleware
	.input(BatchReceiveSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.pharmacy.batchReceive.run({ input }, { actorId }),
		);
	});

export const saleFromRx = scopedAuthMiddleware
	.input(SaleFromRxSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.pharmacy.saleFromRx.run({ input }, { actorId }),
		);
	});

export const partialClose = scopedAuthMiddleware
	.input(PartialCloseSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.pharmacy.partialClose.run({ input }, { actorId }),
		);
	});

export const returnAgainstBill = scopedAuthMiddleware
	.input(ReturnSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.pharmacy.returnAgainstBill.run({ input }, { actorId }),
		);
	});

export const poCreate = scopedAuthMiddleware
	.input(PoCreateSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.pharmacy.poCreate.run({ input }, { actorId }),
		);
	});

export const grnVerify = scopedAuthMiddleware
	.input(GrnVerifySchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.pharmacy.grnVerify.run({ input }, { actorId }),
		);
	});

export const piBook = scopedAuthMiddleware
	.input(PiBookSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.pharmacy.piBook.run({ input }, { actorId }),
		);
	});

export const cndnIssue = scopedAuthMiddleware
	.input(PharmacyCndnSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.pharmacy.cndnIssue.run({ input }, { actorId }),
		);
	});

export const transfer = scopedAuthMiddleware
	.input(TransferSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.pharmacy.transfer.run({ input }, { actorId }),
		);
	});

export const transferAccept = scopedAuthMiddleware
	.input(TransferAcceptSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.pharmacy.transferAccept.run({ input }, { actorId }),
		);
	});

export const reorderSuggest = scopedAuthMiddleware
	.input(ReorderSuggestSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.pharmacy.reorderSuggest.run({ input }, { actorId }),
		);
	});

export const getSale = scopedAuthMiddleware
	.input(PharmacyIdSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.pharmacy.getSale.run({ input }, { actorId }),
		);
	});

export const expiryAlerts = scopedAuthMiddleware
	.input(ExpiryAlertQuerySchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.pharmacy.expiryAlerts.run({ input }, { actorId }),
		);
	});

export const stockLedger = scopedAuthMiddleware
	.input(StockLedgerQuerySchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.pharmacy.stockLedger.run({ input }, { actorId }),
		);
	});

export const stockCorrect = scopedAuthMiddleware
	.input(StockCorrectSchema)
	.handler(async ({ context, input }) => {
		const { actorId, pm, tenantId } = context;
		return pm.run(tenantId, () =>
			pm.healthcare.pharmacy.stockCorrect.run({ input }, { actorId }),
		);
	});
