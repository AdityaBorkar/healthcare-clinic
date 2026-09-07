import { eq } from "drizzle-orm";
import * as v from "valibot";

import { db } from "#/lib/db/server";
import { AuthProcedure, type RpcContext } from "#/rpc/procedure";
import { companies } from "#/schemas/db";

export const getCompany = AuthProcedure.meta({ permissions: ["company:read"] })
	.input(v.object({}))
	.handler(async ({ context }) => {
		const { companyId } = context as unknown as RpcContext;
		const company = await db.query.companies.findFirst({
			where: eq(companies.id, companyId),
		});

		if (!company) {
			throw new Error("Company not found");
		}

		return company;
	});

const updateCompanySchema = v.object({
	gstn: v.optional(v.string()),
	name: v.pipe(v.string(), v.nonEmpty("Company name is required")),
});

export const updateCompany = AuthProcedure.meta({
	permissions: ["company:write"],
})
	.input(updateCompanySchema)
	.handler(async ({ context, input }) => {
		const { companyId } = context as unknown as RpcContext;

		const [updated] = await db
			.update(companies)
			.set({
				...input,
				updatedAt: new Date(),
			})
			.where(eq(companies.id, companyId))
			.returning();

		return updated;
	});
