import { relations } from "drizzle-orm";
import {
	boolean,
	index,
	integer,
	pgTable,
	serial,
	text,
	timestamp,
} from "drizzle-orm/pg-core";

export const bankAccounts = pgTable(
	"bank_accounts",
	{
		accountHolderName: text("account_holder_name").notNull(),
		accountNumber: text("account_number").notNull(),
		bankBranch: text("bank_branch"),
		bankName: text("bank_name").notNull(),
		createdAt: timestamp("created_at").defaultNow(),
		id: serial().primaryKey(),
		ifscCode: text("ifsc_code").notNull(),
		isDefault: boolean("is_default").notNull().default(false),
		ownerId: integer("owner_id").notNull(),
		ownerType: text("owner_type").notNull(),
		updatedAt: timestamp("updated_at").defaultNow(),
	},
	(t) => [index("bank_accounts_owner_idx").on(t.ownerType, t.ownerId)],
);

export const bankAccountsRelations = relations(bankAccounts, () => ({}));

export type BankAccount = typeof bankAccounts.$inferSelect;
export type NewBankAccount = typeof bankAccounts.$inferInsert;
