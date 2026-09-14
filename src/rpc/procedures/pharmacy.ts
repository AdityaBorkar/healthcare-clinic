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
import { authMiddleware } from "../middlewares/auth";
import { requireOrganizationSlug } from "../utils/subdomain";
import { resolveTenantDatabaseName } from "../utils/workspace-organization";

export const itemUpsert = authMiddleware
	.input(ItemUpsertSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.pharmacy.itemUpsert.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const batchReceive = authMiddleware
	.input(BatchReceiveSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.pharmacy.batchReceive.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const saleFromRx = authMiddleware
	.input(SaleFromRxSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.pharmacy.saleFromRx.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const partialClose = authMiddleware
	.input(PartialCloseSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.pharmacy.partialClose.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const returnAgainstBill = authMiddleware
	.input(ReturnSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.pharmacy.returnAgainstBill.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const poCreate = authMiddleware
	.input(PoCreateSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.pharmacy.poCreate.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const grnVerify = authMiddleware
	.input(GrnVerifySchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.pharmacy.grnVerify.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const piBook = authMiddleware
	.input(PiBookSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.pharmacy.piBook.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const cndnIssue = authMiddleware
	.input(PharmacyCndnSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.pharmacy.cndnIssue.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const transfer = authMiddleware
	.input(TransferSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.pharmacy.transfer.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const transferAccept = authMiddleware
	.input(TransferAcceptSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.pharmacy.transferAccept.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const reorderSuggest = authMiddleware
	.input(ReorderSuggestSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.pharmacy.reorderSuggest.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const getSale = authMiddleware
	.input(PharmacyIdSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.pharmacy.getSale.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const expiryAlerts = authMiddleware
	.input(ExpiryAlertQuerySchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.pharmacy.expiryAlerts.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const stockLedger = authMiddleware
	.input(StockLedgerQuerySchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.pharmacy.stockLedger.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});

export const stockCorrect = authMiddleware
	.input(StockCorrectSchema)
	.handler(async ({ context, input }) => {
		requireOrganizationSlug(context.headers);
		const dbName = await resolveTenantDatabaseName(context.headers);
		const { pm } = await import("#/aspen/server");
		return pm.run(dbName, () =>
			pm.healthcare.pharmacy.stockCorrect.run(
				{ input },
				{ actorId: context.session.user.id },
			),
		);
	});
