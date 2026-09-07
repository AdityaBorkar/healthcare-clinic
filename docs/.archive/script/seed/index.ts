import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

import { createId } from "@paralleldrive/cuid2";
import { hashPassword } from "better-auth/crypto";
import { configDotenv } from "dotenv";
import { and, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";

import rolePermissions from "#/lib/auth/permissions.json" with { type: "json" };
import * as schema from "#/schemas/db";

configDotenv({ path: [".env.local", ".env"] });

const db = drizzle(process.env.DATABASE_URL || "", { schema });

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, "data");

interface CompanyInput {
	gstn?: string;
	id: string;
	name: string;
}

interface BranchInput {
	branchCode: string;
	gstn?: string;
	isActive: boolean;
	name: string;
}

interface StaffInput {
	branchAccess?: string;
	branchName: string;
	department?: string;
	designation?: string;
	employeeId: string;
	employmentType?: string;
	roleId: string;
}

interface UserInput {
	email: string;
	emailVerified: boolean;
	image?: string;
	name: string;
	password: string;
	role: string;
	staff?: StaffInput;
}

function readJsonFile<T>(filePath: string): T | null {
	try {
		return JSON.parse(readFileSync(filePath, "utf-8")) as T;
	} catch {
		return null;
	}
}

async function seedCompanies() {
	console.log("🌱 Seeding companies...");
	const companyMap = new Map<string, number>();
	const companies = readJsonFile<CompanyInput[]>(
		join(DATA_DIR, "companies.json"),
	);

	if (!companies) {
		console.log("   ⏭️  No companies.json found, skipping\n");
		return companyMap;
	}

	for (const c of companies) {
		const existing = await db
			.select({ id: schema.companies.id })
			.from(schema.companies)
			.where(eq(schema.companies.name, c.name))
			.limit(1);

		if (existing.length > 0) {
			companyMap.set(c.id, existing[0].id);
			console.log(`   ⏭️  Company already exists: ${c.name}`);
			continue;
		}

		const [inserted] = await db
			.insert(schema.companies)
			.values({
				gstn: c.gstn,
				name: c.name,
			})
			.returning();

		companyMap.set(c.id, inserted.id);
		console.log(`   ✅ Created company: ${c.name}`);
	}

	console.log(`✅ Processed ${companies.length} companies\n`);
	return companyMap;
}

async function seedCompanyData(
	companyId: string,
	dbCompanyId: number,
): Promise<{ branchCount: number; userCount: number }> {
	const branchMap = await seedBranches(companyId, dbCompanyId);
	const userCount = await seedUsers(companyId, dbCompanyId, branchMap);
	return { branchCount: branchMap.size, userCount };
}

async function seedBranches(
	companyId: string,
	dbCompanyId: number,
): Promise<Map<string, number>> {
	const branchMap = new Map<string, number>();
	const branches = readJsonFile<BranchInput[]>(
		join(DATA_DIR, companyId, "branches.json"),
	);

	if (!branches) return branchMap;

	for (const b of branches) {
		const existing = await db
			.select({ id: schema.branches.id })
			.from(schema.branches)
			.where(
				and(
					eq(schema.branches.branchCode, b.branchCode),
					eq(schema.branches.companyId, dbCompanyId),
				),
			)
			.limit(1);

		if (existing.length > 0) {
			branchMap.set(b.name, existing[0].id);
			console.log(`   ⏭️  Branch already exists: ${b.name}`);
			continue;
		}

		const [inserted] = await db
			.insert(schema.branches)
			.values({
				branchCode: b.branchCode,
				companyId: dbCompanyId,
				gstn: b.gstn,
				isActive: b.isActive,
				name: b.name,
			})
			.returning();

		branchMap.set(b.name, inserted.id);
		console.log(`   ✅ Created branch: ${b.name}`);
	}

	return branchMap;
}

async function seedUsers(
	companyId: string,
	dbCompanyId: number,
	branchMap: Map<string, number>,
): Promise<number> {
	let userCount = 0;
	const users = readJsonFile<UserInput[]>(
		join(DATA_DIR, companyId, "users.json"),
	);

	if (!users) return 0;

	for (const u of users) {
		const existing = await db
			.select({ id: schema.user.id })
			.from(schema.user)
			.where(eq(schema.user.email, u.email))
			.limit(1);

		let userId: string;

		if (existing.length > 0) {
			userId = existing[0].id;

			await db
				.update(schema.account)
				.set({ password: await hashPassword(u.password) })
				.where(eq(schema.account.userId, userId));

			await db
				.update(schema.user)
				.set({ image: u.image, name: u.name })
				.where(eq(schema.user.id, userId));

			console.log(`   🔄 Updated user: ${u.name} (${u.email})`);
		} else {
			userId = createId();

			await db.insert(schema.user).values({
				banned: false,
				email: u.email,
				emailVerified: u.emailVerified,
				id: userId,
				image: u.image,
				name: u.name,
				role: u.role,
			});

			await db.insert(schema.account).values({
				accountId: userId,
				createdAt: new Date(),
				id: createId(),
				password: await hashPassword(u.password),
				providerId: "credential",
				updatedAt: new Date(),
				userId,
			});

			console.log(`   ✅ Created user: ${u.name} (${u.email})`);
		}

		if (u.staff) {
			await seedStaffRecord(u.staff, userId, dbCompanyId, branchMap);
		}

		userCount++;
	}

	return userCount;
}

async function seedStaffRecord(
	staffData: StaffInput,
	userId: string,
	companyId: number,
	branchMap: Map<string, number>,
) {
	const existingStaff = await db
		.select({
			branchAccess: schema.staff.branchAccess,
			branchId: schema.staff.branchId,
			id: schema.staff.id,
		})
		.from(schema.staff)
		.where(eq(schema.staff.userId, userId))
		.limit(1);

	if (existingStaff.length > 0) {
		const staffId = existingStaff[0].id;
		const branchId =
			branchMap.get(staffData.branchName) ?? existingStaff[0].branchId;

		let branchAccess: number[] | null = existingStaff[0].branchAccess as
			| number[]
			| null;
		if (staffData.branchAccess === "all") {
			branchAccess = Array.from(branchMap.values());
		}

		await db
			.update(schema.staff)
			.set({
				branchAccess,
				branchId,
				department: staffData.department,
				designation: staffData.designation,
				employmentType: staffData.employmentType,
				roleId: staffData.roleId,
			})
			.where(eq(schema.staff.id, staffId));

		await seedStaffPermissions(staffId, staffData.roleId);
		console.log(
			`   🔄 Updated staff record: ${staffData.employeeId} (${staffData.roleId})`,
		);
		return;
	}

	const branchId = branchMap.get(staffData.branchName);
	if (!branchId) {
		console.log(
			`   ❌ Branch "${staffData.branchName}" not found for staff record, skipping`,
		);
		return;
	}

	let branchAccess: number[] | null = null;
	if (staffData.branchAccess === "all") {
		branchAccess = Array.from(branchMap.values());
	}

	const [staffRecord] = await db
		.insert(schema.staff)
		.values({
			branchAccess,
			branchId,
			companyId,
			department: staffData.department,
			designation: staffData.designation,
			employeeId: staffData.employeeId,
			employmentType: staffData.employmentType,
			roleId: staffData.roleId,
			userId,
		})
		.returning();

	await seedStaffPermissions(staffRecord.id, staffData.roleId);
	console.log(
		`   ✅ Created staff record: ${staffData.employeeId} (${staffData.roleId})`,
	);
}

async function seedStaffPermissions(staffId: number, roleId: string) {
	const permissions =
		rolePermissions.rolePermissions[
			roleId as keyof typeof rolePermissions.rolePermissions
		];
	if (!permissions || permissions.length === 0) return;

	const globalPermissions = permissions.map((p) => `global:${p}`);

	const existing = await db
		.select({ id: schema.staffPermissions.id })
		.from(schema.staffPermissions)
		.where(eq(schema.staffPermissions.staffId, staffId))
		.limit(1);

	if (existing.length > 0) {
		await db
			.update(schema.staffPermissions)
			.set({ permissions: globalPermissions })
			.where(eq(schema.staffPermissions.staffId, staffId));
		console.log(
			`   🔄 Updated ${globalPermissions.length} permissions for role ${roleId}`,
		);
	} else {
		await db.insert(schema.staffPermissions).values({
			permissions: globalPermissions,
			staffId,
		});
		console.log(
			`   ✅ Created ${globalPermissions.length} permissions for role ${roleId}`,
		);
	}
}

async function seed() {
	console.log("\n🚀 Starting database seed...\n");

	try {
		const companyMap = await seedCompanies();

		let totalBranches = 0;
		let totalUsers = 0;

		for (const [companyId, dbCompanyId] of companyMap) {
			console.log(`🌱 Seeding data for company: ${companyId}`);
			const { branchCount, userCount } = await seedCompanyData(
				companyId,
				dbCompanyId,
			);
			totalBranches += branchCount;
			totalUsers += userCount;
			console.log(
				`✅ Company ${companyId}: ${branchCount} branches, ${userCount} users\n`,
			);
		}

		console.log("🎉 Database seed completed successfully!");
		console.log(
			`📊 Total: ${companyMap.size} companies, ${totalBranches} branches, ${totalUsers} users`,
		);
		console.log("\n📋 Seeded credentials:");
		console.log("   Admin:          admin@sushruta.com / admin123");
		console.log(
			"   Receptionist:   receptionist@sushruta.com / receptionist123",
		);
		console.log("   Nurse:          nurse@sushruta.com / nurse123");
		console.log("   Doctor:         doctor@sushruta.com / doctor123");
		console.log("   Finance:        finance@sushruta.com / finance123");
		console.log("   Med Assistant:  medassist@sushruta.com / medassist123");
	} catch (error) {
		console.error("\n❌ Error seeding database:", error);
		process.exit(1);
	}

	process.exit(0);
}

seed();
