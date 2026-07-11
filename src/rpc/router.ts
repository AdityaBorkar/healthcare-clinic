import * as bankAccounts from "./procedures/bank-accounts";
import * as branches from "./procedures/branches";
import * as compliance from "./procedures/compliance";
import * as connections from "./procedures/connections";
import * as organization from "./procedures/organization";

export const router = {
  bankAccounts,
  branches,
  compliance,
  connections,
  organization,
};

export type Router = typeof router;
