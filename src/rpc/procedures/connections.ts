import type {
  ConnectionFilters,
  CreateConnectionInput,
  UpdateConnectionInput,
} from "@aspen-os/organization";
import { os } from "@orpc/server";
import { object, optional, string } from "valibot";

import { f } from "@/aspen/server";
import {
  ConnectionCreateSchema,
  ConnectionFiltersInputSchema,
  ConnectionUpdateSchema,
} from "../schema";

const base = os.$context<Record<string, never>>();
const IdSchema = object({ id: string() });

export const list = base
  .input(ConnectionFiltersInputSchema)
  .handler(async ({ input }) => {
    return f.organization.connections.list(
      input as unknown as ConnectionFilters,
    );
  });

export const getById = base.input(IdSchema).handler(async ({ input }) => {
  return f.organization.connections.getById(input.id);
});

export const create = base
  .input(ConnectionCreateSchema)
  .handler(async ({ input }) => {
    return f.organization.connections.create(
      input as unknown as CreateConnectionInput,
    );
  });

export const update = base
  .input(object({ data: ConnectionUpdateSchema, id: string() }))
  .handler(async ({ input }) => {
    return f.organization.connections.update(
      input.id,
      input.data as unknown as UpdateConnectionInput,
    );
  });

export const archive = base.input(IdSchema).handler(async ({ input }) => {
  return f.organization.connections.archive(input.id);
});

export const search = base
  .input(
    object({
      filters: optional(ConnectionFiltersInputSchema),
      query: string(),
    }),
  )
  .handler(async ({ input }) => {
    return f.organization.connections.search(
      input.query,
      input.filters as unknown as ConnectionFilters | undefined,
    );
  });
