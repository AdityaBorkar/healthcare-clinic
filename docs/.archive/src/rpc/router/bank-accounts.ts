import { and, eq } from "drizzle-orm";
import * as v from "valibot";

import { db } from "#/lib/db/server";
import { AuthProcedure } from "#/rpc/procedure";
import { bankAccounts } from "#/schemas/db";

const ownerType = v.picklist([
	"practitioner",
	"entity",
	"company",
	"branch",
	"employee",
	"patient",
	"staff",
]);

const createBankAccountSchema = v.object({
	accountHolderName: v.pipe(
		v.string(),
		v.nonEmpty("Account holder name is required"),
	),
	accountNumber: v.pipe(v.string(), v.nonEmpty("Account number is required")),
	bankBranch: v.optional(v.string()),
	bankName: v.pipe(v.string(), v.nonEmpty("Bank name is required")),
	ifscCode: v.pipe(v.string(), v.nonEmpty("IFSC code is required")),
	isDefault: v.optional(v.boolean(), false),
	ownerId: v.number(),
	ownerType,
});

const updateBankAccountSchema = v.object({
	accountHolderName: v.optional(v.string()),
	accountNumber: v.optional(v.string()),
	bankBranch: v.optional(v.string()),
	bankName: v.optional(v.string()),
	id: v.number(),
	ifscCode: v.optional(v.string()),
	isDefault: v.optional(v.boolean()),
});

export const listBankAccounts = AuthProcedure.meta({
	permissions: ["finance:read"],
})
	.input(v.object({ ownerId: v.number(), ownerType }))
	.handler(async ({ input }) => {
		const accounts = await db.query.bankAccounts.findMany({
			orderBy: (bankAccounts, { desc }) => [
				desc(bankAccounts.isDefault),
				desc(bankAccounts.createdAt),
			],
			where: and(
				eq(bankAccounts.ownerType, input.ownerType),
				eq(bankAccounts.ownerId, input.ownerId),
			),
		});
		return accounts;
	});

export const createBankAccount = AuthProcedure.meta({
	permissions: ["finance:write"],
})
	.input(createBankAccountSchema)
	.handler(async ({ input }) => {
		if (input.isDefault) {
			await db
				.update(bankAccounts)
				.set({ isDefault: false, updatedAt: new Date() })
				.where(
					and(
						eq(bankAccounts.ownerType, input.ownerType),
						eq(bankAccounts.ownerId, input.ownerId),
					),
				);
		}

		const [account] = await db.insert(bankAccounts).values(input).returning();
		return account;
	});

export const updateBankAccount = AuthProcedure.meta({
	permissions: ["finance:write"],
})
	.input(updateBankAccountSchema)
	.handler(async ({ input }) => {
		const { id, ...updateData } = input;

		if (updateData.isDefault) {
			const existing = await db.query.bankAccounts.findFirst({
				where: eq(bankAccounts.id, id),
			});
			if (existing) {
				await db
					.update(bankAccounts)
					.set({ isDefault: false, updatedAt: new Date() })
					.where(
						and(
							eq(bankAccounts.ownerType, existing.ownerType),
							eq(bankAccounts.ownerId, existing.ownerId),
						),
					);
			}
		}

		const [updated] = await db
			.update(bankAccounts)
			.set({ ...updateData, updatedAt: new Date() })
			.where(eq(bankAccounts.id, id))
			.returning();

		if (!updated) {
			throw new Error("Bank account not found");
		}

		return updated;
	});

export const deleteBankAccount = AuthProcedure.meta({
	permissions: ["finance:write"],
})
	.input(v.object({ id: v.number() }))
	.handler(async ({ input }) => {
		await db.delete(bankAccounts).where(eq(bankAccounts.id, input.id));
		return { success: true };
	});

export const setDefaultBankAccount = AuthProcedure.meta({
	permissions: ["finance:write"],
})
	.input(
		v.object({
			accountId: v.number(),
			ownerId: v.number(),
			ownerType,
		}),
	)
	.handler(async ({ input }) => {
		await db
			.update(bankAccounts)
			.set({ isDefault: false, updatedAt: new Date() })
			.where(
				and(
					eq(bankAccounts.ownerType, input.ownerType),
					eq(bankAccounts.ownerId, input.ownerId),
				),
			);

		const [updated] = await db
			.update(bankAccounts)
			.set({ isDefault: true, updatedAt: new Date() })
			.where(eq(bankAccounts.id, input.accountId))
			.returning();

		if (!updated) {
			throw new Error("Bank account not found");
		}

		return updated;
	});
