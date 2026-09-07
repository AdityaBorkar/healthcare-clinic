import { and, desc, eq, gte, lte } from "drizzle-orm";
import * as v from "valibot";

import { db } from "#/lib/db/server";
import { AuthProcedure } from "#/rpc/procedure";
import { cdcSink, cdcStaff } from "#/schemas/db";

export const getAuditLogForUser = AuthProcedure.meta({
	permissions: ["reports:view"],
})
	.input(
		v.object({
			limit: v.optional(v.number(), 50),
			offset: v.optional(v.number(), 0),
			userId: v.string(),
		}),
	)
	.handler(async ({ input }) => {
		const entries = await db
			.select({
				field: cdcStaff.field,
				id: cdcStaff.id,
				newValue: cdcStaff.newValue,
				oldValue: cdcStaff.oldValue,
				operation: cdcSink.operation,
				sourceId: cdcSink.sourceId,
				sourceTable: cdcSink.sourceTable,
				timestamp: cdcSink.timestamp,
				userId: cdcSink.userId,
			})
			.from(cdcStaff)
			.innerJoin(cdcSink, eq(cdcStaff.sinkId, cdcSink.id))
			.where(eq(cdcSink.userId, input.userId))
			.orderBy(desc(cdcSink.timestamp))
			.limit(input.limit)
			.offset(input.offset);

		return entries;
	});

export const getGlobalAuditLog = AuthProcedure.meta({
	permissions: ["reports:view"],
})
	.input(
		v.object({
			dateFrom: v.optional(v.pipe(v.string(), v.isoDateTime())),
			dateTo: v.optional(v.pipe(v.string(), v.isoDateTime())),
			entity: v.optional(v.string()),
			limit: v.optional(v.number(), 50),
			offset: v.optional(v.number(), 0),
			operation: v.optional(v.string()),
			userId: v.optional(v.string()),
		}),
	)
	.handler(async ({ input }) => {
		const conditions = [];

		if (input.userId) {
			conditions.push(eq(cdcSink.userId, input.userId));
		}
		if (input.entity) {
			conditions.push(eq(cdcSink.sourceTable, input.entity));
		}
		if (input.operation) {
			conditions.push(eq(cdcSink.operation, input.operation));
		}
		if (input.dateFrom) {
			conditions.push(gte(cdcSink.timestamp, new Date(input.dateFrom)));
		}
		if (input.dateTo) {
			conditions.push(lte(cdcSink.timestamp, new Date(input.dateTo)));
		}

		const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

		const entries = await db
			.select({
				field: cdcStaff.field,
				id: cdcStaff.id,
				newValue: cdcStaff.newValue,
				oldValue: cdcStaff.oldValue,
				operation: cdcSink.operation,
				sourceId: cdcSink.sourceId,
				sourceTable: cdcSink.sourceTable,
				timestamp: cdcSink.timestamp,
				userId: cdcSink.userId,
			})
			.from(cdcStaff)
			.innerJoin(cdcSink, eq(cdcStaff.sinkId, cdcSink.id))
			.where(whereClause)
			.orderBy(desc(cdcSink.timestamp))
			.limit(input.limit)
			.offset(input.offset);

		return entries;
	});
