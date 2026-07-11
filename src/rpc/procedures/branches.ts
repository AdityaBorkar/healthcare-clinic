import type {
  BranchFilters,
  CreateBranchInput,
  UpdateBranchInput,
} from "@aspen-os/organization";
import { os } from "@orpc/server";
import { object, string } from "valibot";

import { f } from "@/aspen/server";
import {
  BranchCreateSchema,
  BranchFiltersInputSchema,
  BranchUpdateSchema,
} from "../schema";

const base = os.$context<Record<string, never>>();
const IdSchema = object({ id: string() });

export const list = base
  .input(BranchFiltersInputSchema)
  .handler(async ({ input }) => {
    return f.organization.branches.list(input as unknown as BranchFilters);
  });

export const getById = base.input(IdSchema).handler(async ({ input }) => {
  return f.organization.branches.getById(input.id);
});

export const getTree = base.handler(async () => {
  return f.organization.branches.getTree();
});

export const create = base
  .input(BranchCreateSchema)
  .handler(async ({ input }) => {
    return f.organization.branches.create(
      input as unknown as CreateBranchInput,
    );
  });

export const update = base
  .input(object({ data: BranchUpdateSchema, id: string() }))
  .handler(async ({ input }) => {
    return f.organization.branches.update(
      input.id,
      input.data as unknown as UpdateBranchInput,
    );
  });

export const archive = base.input(IdSchema).handler(async ({ input }) => {
  return f.organization.branches.archive(input.id);
});

export const activate = base.input(IdSchema).handler(async ({ input }) => {
  return f.organization.branches.activate(input.id);
});

export const deactivate = base.input(IdSchema).handler(async ({ input }) => {
  return f.organization.branches.deactivate(input.id);
});
