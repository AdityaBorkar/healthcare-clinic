import type {
  CreateBankAccountInput,
  UpdateBankAccountInput,
} from "@aspen-os/organization";
import { os } from "@orpc/server";
import { object, string } from "valibot";

import { f } from "@/aspen/server";
import { BankAccountCreateSchema, BankAccountUpdateSchema } from "../schema";

const base = os.$context<Record<string, never>>();
const IdSchema = object({ id: string() });

export const list = base.handler(async () => {
  return f.organization.bankAccounts.list();
});

export const getById = base.input(IdSchema).handler(async ({ input }) => {
  return f.organization.bankAccounts.getById(input.id);
});

export const create = base
  .input(BankAccountCreateSchema)
  .handler(async ({ input }) => {
    return f.organization.bankAccounts.create(
      input as unknown as CreateBankAccountInput,
    );
  });

export const update = base
  .input(object({ data: BankAccountUpdateSchema, id: string() }))
  .handler(async ({ input }) => {
    return f.organization.bankAccounts.update(
      input.id,
      input.data as unknown as UpdateBankAccountInput,
    );
  });

export const remove = base.input(IdSchema).handler(async ({ input }) => {
  return f.organization.bankAccounts.delete(input.id);
});

export const setPrimary = base.input(IdSchema).handler(async ({ input }) => {
  return f.organization.bankAccounts.setPrimary(input.id);
});
