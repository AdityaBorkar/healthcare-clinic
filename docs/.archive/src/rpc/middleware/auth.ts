import { ORPCError } from "@orpc/server";
import { eq } from "drizzle-orm";

import { auth } from "#/lib/auth/server";
import { db } from "#/lib/db/server";
import { staff, staffPermissions } from "#/schemas/db";
import { base } from ".";

export interface RpcContext {
	branchId: string | null;
	companyId: number;
	permissions: string[];
	session: {
		user: { email: string; id: string; name: string };
	};
	staffRecord: {
		branchAccess: number[] | null;
		branchId: number | null;
		companyId: number;
		employeeId: string;
		id: number;
		isActive: boolean;
		roleId: string;
		userId: string;
	};
}

export const authMiddleware = base.middleware(async ({ context, next }) => {
	const { headers } = context;
	const branchId = context.headers.get("x-branch-id");

	const authData = await auth.api.getSession({ headers });
	if (!authData?.session || !authData?.user) {
		throw new ORPCError("UNAUTHORIZED");
	}

	const staffRecord = await db.query.staff.findFirst({
		columns: {
			branchAccess: true,
			branchId: true,
			companyId: true,
			employeeId: true,
			id: true,
			isActive: true,
			roleId: true,
			userId: true,
		},
		where: eq(staff.userId, authData.user.id),
	});
	if (!staffRecord) {
		throw new ORPCError("FORBIDDEN", { message: "User record not found." });
	}
	if (!staffRecord.isActive) {
		throw new ORPCError("FORBIDDEN", { message: "User acccess disabled." });
	}

	const permRecord = await db.query.staffPermissions.findFirst({
		where: eq(staffPermissions.staffId, staffRecord.id),
	});
	const permissions = permRecord?.permissions ?? [];
	// const requiredPermissions = procedure["~orpc"].meta.permissions ?? [];
	// if (requiredPermissions.length === 0) {
	//   return next({ context });
	// }
	// for (const required of requiredPermissions) {
	//   let hasPermission = false;
	//   if (branchId) {
	//     hasPermission = permissions.includes(`${branchId}:${required}`);
	//   }
	//   if (!hasPermission) {
	//     hasPermission = permissions.some((p) => p.endsWith(`:${required}`));
	//   }
	//   if (!hasPermission) {
	//     throw new ORPCError("FORBIDDEN", {
	//       message: `Missing permission: ${required}`,
	//     });
	//   }
	// }

	return next({
		context: {
			...authData,
			branchId,
			companyId: staffRecord.companyId,
			permissions,
			staffRecord,
		},
	});
});
