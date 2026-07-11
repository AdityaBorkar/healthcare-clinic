import type {
  ComplianceFilters,
  CreateComplianceDocumentInput,
  UpdateComplianceDocumentInput,
} from "@aspen-os/organization";
import { os } from "@orpc/server";
import { object, string } from "valibot";

import { f } from "@/aspen/server";
import {
  ComplianceCreateSchema,
  ComplianceFiltersInputSchema,
  ComplianceUpdateSchema,
} from "../schema";

const base = os.$context<Record<string, never>>();
const IdSchema = object({ id: string() });

export const list = base
  .input(ComplianceFiltersInputSchema)
  .handler(async ({ input }) => {
    return f.organization.compliance.list(
      input as unknown as ComplianceFilters,
    );
  });

export const getById = base.input(IdSchema).handler(async ({ input }) => {
  return f.organization.compliance.getById(input.id);
});

export const create = base
  .input(ComplianceCreateSchema)
  .handler(async ({ input }) => {
    return f.organization.compliance.create({
      ...input,
      createdBy: "system",
    } as unknown as CreateComplianceDocumentInput);
  });

export const update = base
  .input(object({ data: ComplianceUpdateSchema, id: string() }))
  .handler(async ({ input }) => {
    return f.organization.compliance.update(
      input.id,
      input.data as unknown as UpdateComplianceDocumentInput,
    );
  });

export const archive = base.input(IdSchema).handler(async ({ input }) => {
  return f.organization.compliance.archive(input.id);
});

export const getSummary = base.handler(async () => {
  return f.organization.compliance.getSummary();
});

export const getExpiring = base.handler(async () => {
  return f.organization.compliance.getExpiring(90);
});
