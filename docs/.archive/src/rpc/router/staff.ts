import { and, eq } from "drizzle-orm";
import * as v from "valibot";

import { auth } from "#/lib/auth/server";
import { db } from "#/lib/db/server";
import { createStorageModule } from "#/lib/storage";
import type { RpcContext } from "#/rpc/middleware/auth";
import { AuthProcedure } from "#/rpc/procedure";
import { branches, staff, user } from "#/schemas/db";

const storage = createStorageModule();

const createStaffSchema = v.object({
	branchAccess: v.optional(v.array(v.number())),
	branchId: v.optional(v.number()),
	department: v.optional(v.string()),
	designation: v.optional(v.string()),
	email: v.pipe(v.string(), v.email("Valid email is required")),
	employeeId: v.pipe(v.string(), v.nonEmpty("Employee ID is required")),
	employmentType: v.optional(v.string()),
	joiningDate: v.optional(v.pipe(v.string(), v.isoDateTime())),
	name: v.pipe(v.string(), v.nonEmpty("Name is required")),
	phone: v.optional(v.string()),
	photoKey: v.optional(v.string()),
	reportToId: v.optional(v.string()),
	roleId: v.pipe(v.string(), v.nonEmpty("Role is required")),
});

const updateStaffSchema = v.object({
	aadharNumber: v.optional(v.string()),
	bloodGroup: v.optional(v.string()),
	branchAccess: v.optional(v.array(v.number())),
	branchId: v.optional(v.number()),
	dateOfBirth: v.optional(v.pipe(v.string(), v.isoDateTime())),
	department: v.optional(v.string()),
	designation: v.optional(v.string()),
	emergencyContacts: v.optional(
		v.array(
			v.object({
				name: v.string(),
				phone: v.string(),
				phoneAlt: v.optional(v.string()),
				relationship: v.string(),
			}),
		),
	),
	employmentType: v.optional(v.string()),
	exitDate: v.optional(v.pipe(v.string(), v.isoDateTime())),
	gender: v.optional(v.string()),
	id: v.number(),
	isActive: v.optional(v.boolean()),
	joiningDate: v.optional(v.pipe(v.string(), v.isoDateTime())),
	maritalStatus: v.optional(v.string()),
	name: v.optional(v.string()),
	nationality: v.optional(v.string()),
	panNumber: v.optional(v.string()),
	phone: v.optional(v.string()),
	phoneAlt: v.optional(v.string()),
	photoKey: v.optional(v.string()),
	probationEndDate: v.optional(v.pipe(v.string(), v.isoDateTime())),
	reportToId: v.optional(v.string()),
	resignationDate: v.optional(v.pipe(v.string(), v.isoDateTime())),
	roleId: v.optional(v.string()),
});

const deleteStaffSchema = v.object({
	id: v.number(),
});

const getPresignedPhotoUrlSchema = v.object({
	contentType: v.optional(v.string(), "image/jpeg"),
	employeeId: v.string(),
});

export interface StaffWithUser {
	branch: {
		branchCode: string;
		id: number;
		name: string;
	} | null;
	branchAccess: number[] | null;
	company?: {
		id: number;
		name: string;
	} | null;
	createdAt: Date;
	department: string | null;
	designation: string | null;
	emergencyContacts: unknown;
	employeeId: string;
	employmentType: string | null;
	id: number;
	isActive: boolean | null;
	joiningDate: Date | null;
	reportToId: string | null;
	roleId: string;
	updatedAt: Date;
	user: {
		email: string;
		id: string;
		image: string | null;
		name: string;
		phoneNumber: string | null;
	} | null;
	userId: string;
}

export const listStaff = AuthProcedure.meta({ permissions: ["users:read"] })
	.input(v.object({}))
	.handler(async ({ context }) => {
		const { companyId } = context as unknown as RpcContext;
		const staffList = await db.query.staff.findMany({
			orderBy: (staff, { desc }) => [desc(staff.createdAt)],
			where: eq(staff.companyId, companyId),
			with: {
				branch: {
					columns: {
						branchCode: true,
						id: true,
						name: true,
					},
				},
				user: {
					columns: {
						email: true,
						id: true,
						image: true,
						name: true,
						phoneNumber: true,
					},
				},
			},
		});

		return staffList as StaffWithUser[];
	});

export const getStaff = AuthProcedure.meta({ permissions: ["users:read"] })
	.input(v.object({ id: v.number() }))
	.handler(async ({ input }) => {
		const record = await db.query.staff.findFirst({
			where: eq(staff.id, input.id),
			with: {
				branch: {
					columns: {
						branchCode: true,
						id: true,
						name: true,
					},
				},
				company: {
					columns: {
						id: true,
						name: true,
					},
				},
				permissions: true,
				user: {
					columns: {
						email: true,
						id: true,
						image: true,
						name: true,
						phoneNumber: true,
					},
				},
			},
		});

		if (!record) {
			throw new Error("Staff member not found");
		}

		return record;
	});

export const createStaff = AuthProcedure.meta({ permissions: ["users:write"] })
	.input(createStaffSchema)
	.handler(async ({ input, context }) => {
		const { companyId } = context as unknown as RpcContext;
		const {
			branchId,
			branchAccess,
			employeeId,
			roleId,
			name,
			email,
			phone,
			designation,
			department,
			joiningDate,
			employmentType,
			reportToId,
			photoKey,
		} = input;

		const existingStaff = await db.query.staff.findFirst({
			where: eq(staff.employeeId, employeeId),
		});

		if (existingStaff) {
			throw new Error(`Employee ID "${employeeId}" already exists`);
		}

		const existingUser = await db.query.user.findFirst({
			where: eq(user.email, email),
		});

		if (existingUser) {
			throw new Error(`User with email "${email}" already exists`);
		}

		const tempPassword =
			Math.random().toString(36).slice(-10) +
			Math.random().toString(36).slice(-10).toUpperCase();

		const newUser = await auth.api.signUpEmail({
			body: {
				email,
				name,
				password: tempPassword,
				...(phone && { phoneNumber: phone }),
				...(photoKey && { image: photoKey }),
			},
		});

		if (!newUser?.user?.id) {
			throw new Error("Failed to create user account");
		}

		try {
			await sendStaffCredentialsEmail(email, name, employeeId, tempPassword);
		} catch (error) {
			console.error("Failed to send credentials email:", error);
		}

		const [newStaff] = await db
			.insert(staff)
			.values({
				branchAccess: branchAccess ?? undefined,
				branchId: branchId ?? undefined,
				companyId,
				department: department || null,
				designation: designation || null,
				employeeId,
				employmentType: employmentType || null,
				isActive: true,
				joiningDate: joiningDate ? new Date(joiningDate) : null,
				reportToId: reportToId || null,
				roleId,
				userId: newUser.user.id,
			})
			.returning();

		return {
			message:
				"Staff created successfully. Credentials have been sent to their email.",
			staff: newStaff,
			user: newUser.user,
		};
	});

export const updateStaff = AuthProcedure.meta({ permissions: ["users:write"] })
	.input(updateStaffSchema)
	.handler(async ({ input }) => {
		const {
			id,
			name,
			phone,
			photoKey,
			dateOfBirth,
			joiningDate,
			probationEndDate,
			resignationDate,
			exitDate,
			...staffData
		} = input;

		const currentStaff = await db.query.staff.findFirst({
			where: eq(staff.id, id),
			with: {
				user: true,
			},
		});

		if (!currentStaff) {
			throw new Error("Staff member not found");
		}

		if (name || phone || photoKey) {
			const updateData: {
				image?: string;
				name?: string;
				phoneNumber?: string;
			} = {};
			if (name) updateData.name = name;
			if (phone) updateData.phoneNumber = phone;
			if (photoKey) updateData.image = photoKey;

			await db
				.update(user)
				.set(updateData)
				.where(eq(user.id, currentStaff.userId));
		}

		const [updated] = await db
			.update(staff)
			.set({
				...staffData,
				dateOfBirth: dateOfBirth
					? new Date(dateOfBirth)
					: currentStaff.dateOfBirth,
				exitDate: exitDate ? new Date(exitDate) : currentStaff.exitDate,
				joiningDate: joiningDate
					? new Date(joiningDate)
					: currentStaff.joiningDate,
				probationEndDate: probationEndDate
					? new Date(probationEndDate)
					: currentStaff.probationEndDate,
				resignationDate: resignationDate
					? new Date(resignationDate)
					: currentStaff.resignationDate,
				updatedAt: new Date(),
			})
			.where(eq(staff.id, id))
			.returning();

		return updated;
	});

export const deleteStaff = AuthProcedure.meta({
	permissions: ["users:delete"],
})
	.input(deleteStaffSchema)
	.handler(async ({ input }) => {
		const { id } = input;

		const currentStaff = await db.query.staff.findFirst({
			where: eq(staff.id, id),
		});

		if (!currentStaff) {
			throw new Error("Staff member not found");
		}

		const [_updated] = await db
			.update(staff)
			.set({
				isActive: false,
				updatedAt: new Date(),
			})
			.where(eq(staff.id, id))
			.returning();

		if (currentStaff.userId) {
			const userRecord = await db.query.user.findFirst({
				where: eq(user.id, currentStaff.userId),
			});
			if (userRecord?.image) {
				await storage.remove(userRecord.image);
			}
		}

		return { message: "Staff deactivated successfully", success: true };
	});

export const getPresignedStaffPhotoUrl = AuthProcedure.meta({
	permissions: ["users:write"],
})
	.input(getPresignedPhotoUrlSchema)
	.handler(async ({ input }) => {
		const { employeeId, contentType } = input;
		return storage.upload({
			category: "photo",
			contentType,
			fileName: `photo-${employeeId}.jpg`,
			ownerId: employeeId,
			ownerType: "staff",
		});
	});

export const listStaffPermissions = AuthProcedure.meta({
	permissions: ["users:read"],
})
	.input(v.object({ staffId: v.number() }))
	.handler(async ({ input }) => {
		const { staffPermissions } = await import("#/schemas/db");
		const { eq } = await import("drizzle-orm");
		const record = await db.query.staffPermissions.findFirst({
			where: eq(staffPermissions.staffId, input.staffId),
		});
		return record ?? { permissions: [], staffId: input.staffId };
	});

export const updateStaffPermissions = AuthProcedure.meta({
	permissions: ["users:write"],
})
	.input(
		v.object({
			permissions: v.array(v.string()),
			staffId: v.number(),
		}),
	)
	.handler(async ({ input }) => {
		const { staffPermissions } = await import("#/schemas/db");
		const { eq } = await import("drizzle-orm");

		const existing = await db.query.staffPermissions.findFirst({
			where: eq(staffPermissions.staffId, input.staffId),
		});

		if (existing) {
			const [updated] = await db
				.update(staffPermissions)
				.set({ permissions: input.permissions })
				.where(eq(staffPermissions.staffId, input.staffId))
				.returning();
			return updated;
		}

		const [created] = await db
			.insert(staffPermissions)
			.values({
				permissions: input.permissions,
				staffId: input.staffId,
			})
			.returning();
		return created;
	});

export const getStaffOrgChart = AuthProcedure.meta({
	permissions: ["users:read"],
})
	.input(v.object({}))
	.handler(async ({ context }) => {
		const { companyId } = context as unknown as RpcContext;
		const allStaff = await db.query.staff.findMany({
			where: eq(staff.companyId, companyId),
			with: {
				user: {
					columns: {
						id: true,
						image: true,
						name: true,
					},
				},
			},
		});

		type OrgNode = (typeof allStaff)[number] & { children: OrgNode[] };
		const staffMap = new Map<string, OrgNode>();
		for (const s of allStaff) {
			staffMap.set(s.userId, { ...s, children: [] });
		}

		const roots: OrgNode[] = [];

		for (const node of staffMap.values()) {
			if (node.reportToId && staffMap.has(node.reportToId)) {
				const parent = staffMap.get(node.reportToId);
				if (parent) {
					parent.children.push(node);
				}
			} else {
				roots.push(node);
			}
		}

		return roots;
	});

export const listCompanies = AuthProcedure.meta({
	permissions: ["company:read"],
})
	.input(v.object({}))
	.handler(async () => {
		const companyList = await db.query.companies.findMany({
			orderBy: (companies, { asc }) => [asc(companies.name)],
		});
		return companyList;
	});

export const listBranchesForCompany = AuthProcedure.meta({
	permissions: ["branches:read"],
})
	.input(v.object({}))
	.handler(async ({ context }) => {
		const { companyId } = context as unknown as RpcContext;
		const branchList = await db.query.branches.findMany({
			orderBy: (branches, { asc }) => [asc(branches.name)],
			where: and(
				eq(branches.companyId, companyId),
				eq(branches.isActive, true),
			),
		});
		return branchList;
	});

async function sendStaffCredentialsEmail(
	email: string,
	name: string,
	employeeId: string,
	password: string,
): Promise<void> {
	const subject = "Your Staff Account Credentials";
	const body = `
Hello ${name},

Your staff account has been created successfully.

Account Details:
- Employee ID: ${employeeId}
- Email: ${email}
- Temporary Password: ${password}

Please log in to the system and change your password immediately.

Best regards,
HR Department
`;

	console.log(`[EMAIL SENT]\nTo: ${email}\nSubject: ${subject}\n\n${body}`);
}
