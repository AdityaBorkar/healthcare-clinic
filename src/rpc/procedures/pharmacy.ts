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
import { authed } from "../middlewares/auth";
import { requireOrganizationSlug } from "../utils/subdomain";
import { resolveTenantDatabaseName } from "../utils/workspace-organization";

export const itemUpsert = authed
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

export const batchReceive = authed
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

export const saleFromRx = authed
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

export const partialClose = authed
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

export const returnAgainstBill = authed
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

export const poCreate = authed
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

export const grnVerify = authed
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

export const piBook = authed
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

export const cndnIssue = authed
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

export const transfer = authed
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

export const transferAccept = authed
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

export const reorderSuggest = authed
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

export const getSale = authed
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

export const expiryAlerts = authed
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

export const stockLedger = authed
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

export const stockCorrect = authed
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
