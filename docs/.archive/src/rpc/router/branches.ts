import { ORPCError } from "@orpc/server";
import { and, eq, inArray } from "drizzle-orm";
import * as v from "valibot";

import { db } from "#/lib/db/server";
import { AuthProcedure, type RpcContext } from "#/rpc/procedure";
import { branches, companies } from "#/schemas/db";

export const listBranches = AuthProcedure.meta({
	permissions: ["branches:read"],
})
	.input(v.object({}))
	.handler(async ({ context }) => {
		const { companyId } = context as unknown as RpcContext;
		const branchList = await db.query.branches.findMany({
			orderBy: (branches, { asc }) => [asc(branches.name)],
			where: eq(branches.companyId, companyId),
		});

		return branchList;
	});

export const listUserBranches = AuthProcedure.handler(async ({ context }) => {
	const { branchAccess, branchId, companyId } = (
		context as unknown as RpcContext
	).staffRecord;

	const accessibleIds = branchAccess ?? (branchId ? [branchId] : []);

	if (accessibleIds.length === 0) {
		return { branches: [], company: null };
	}

	const [branchList, company] = await Promise.all([
		db.query.branches.findMany({
			orderBy: (branches, { asc }) => [asc(branches.name)],
			where: and(
				eq(branches.companyId, companyId),
				inArray(branches.id, accessibleIds),
				eq(branches.isActive, true),
			),
		}),
		db.query.companies.findFirst({
			where: eq(companies.id, companyId),
		}),
	]);

	return {
		branches: branchList.map((b) => ({
			id: b.id,
			name: b.name,
		})),
		company: company ? { id: company.id, name: company.name } : null,
	};
});

export const validateBranch = AuthProcedure.input(
	v.object({ branchId: v.number() }),
).handler(async ({ context, input }) => {
	const {
		branchAccess,
		branchId: staffBranchId,
		companyId,
	} = (context as unknown as RpcContext).staffRecord;

	const accessibleIds = branchAccess ?? (staffBranchId ? [staffBranchId] : []);

	if (!accessibleIds.includes(input.branchId)) {
		throw new ORPCError("FORBIDDEN", {
			message: `Branch ${input.branchId} is not accessible by this user`,
		});
	}

	const branch = await db.query.branches.findFirst({
		columns: { id: true, isActive: true, name: true },
		where: and(
			eq(branches.id, input.branchId),
			eq(branches.companyId, companyId),
		),
	});

	if (!branch) {
		throw new ORPCError("NOT_FOUND", {
			message: `Branch with ID ${input.branchId} not found`,
		});
	}

	if (!branch.isActive) {
		throw new ORPCError("FORBIDDEN", {
			message: `Branch "${branch.name}" is inactive`,
		});
	}

	return branch;
});

const createBranchSchema = v.object({
	branchCode: v.pipe(v.string(), v.nonEmpty("Branch code is required")),
	gstn: v.optional(v.string()),
	name: v.pipe(v.string(), v.nonEmpty("Branch name is required")),
});

export const createBranch = AuthProcedure.meta({
	permissions: ["branches:write"],
})
	.input(createBranchSchema)
	.handler(async ({ context, input }) => {
		const { companyId } = context as unknown as RpcContext;
		const existing = await db.query.branches.findFirst({
			where: and(
				eq(branches.companyId, companyId),
				eq(branches.branchCode, input.branchCode),
			),
		});

		if (existing) {
			throw new Error("Branch code already exists for this company");
		}

		const [created] = await db
			.insert(branches)
			.values({
				...input,
				companyId,
				isActive: true,
			})
			.returning();

		return created;
	});

const updateBranchSchema = v.object({
	branchCode: v.pipe(v.string(), v.nonEmpty("Branch code is required")),
	gstn: v.optional(v.string()),
	id: v.number(),
	isActive: v.optional(v.boolean()),
	name: v.pipe(v.string(), v.nonEmpty("Branch name is required")),
});

export const updateBranch = AuthProcedure.meta({
	permissions: ["branches:write"],
})
	.input(updateBranchSchema)
	.handler(async ({ input }) => {
		const { id, ...data } = input;

		const branch = await db.query.branches.findFirst({
			where: eq(branches.id, id),
		});

		if (!branch) {
			throw new Error("Branch not found");
		}

		if (data.branchCode !== branch.branchCode) {
			const existing = await db.query.branches.findFirst({
				where: and(
					eq(branches.companyId, branch.companyId),
					eq(branches.branchCode, data.branchCode),
				),
			});

			if (existing && existing.id !== id) {
				throw new Error("Branch code already exists for this company");
			}
		}

		const [updated] = await db
			.update(branches)
			.set({
				...data,
				updatedAt: new Date(),
			})
			.where(eq(branches.id, id))
			.returning();

		return updated;
	});

export const deleteBranch = AuthProcedure.meta({
	permissions: ["branches:delete"],
})
	.input(v.object({ id: v.number() }))
	.handler(async ({ input }) => {
		const branch = await db.query.branches.findFirst({
			where: eq(branches.id, input.id),
		});

		if (!branch) {
			throw new Error("Branch not found");
		}

		await db.delete(branches).where(eq(branches.id, input.id));

		return { success: true };
	});
