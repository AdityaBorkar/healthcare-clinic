import * as cli from "@clack/prompts";

import { pm } from "../../src/aspen/server";

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function promptInput() {
	cli.intro("Local seed — create organization and user");

	const input = await cli.group(
		{
			orgName: () =>
				cli.text({
					initialValue: "Acme Clinic",
					message: "Organization name",
					placeholder: "Acme Clinic",
					validate: (value?: string) =>
						(value ?? "").trim().length === 0 ? "Name is required" : undefined,
				}),
			orgSlug: () =>
				cli.text({
					initialValue: "acme",
					message: "Organization slug",
					placeholder: "acme",
					validate: (value?: string) => {
						const slug = (value ?? "").trim().toLowerCase();
						if (slug.length < 3) return "Must be at least 3 characters";
						if (slug.length > 63) return "Must be at most 63 characters";
						if (!SLUG_PATTERN.test(slug))
							return "Must be URL-safe alphanumeric with hyphens";
					},
				}),
			userEmail: () =>
				cli.text({
					initialValue: "admin@clinic.local",
					message: "User email",
					placeholder: "admin@clinic.local",
					validate: (value?: string) =>
						EMAIL_PATTERN.test((value ?? "").trim())
							? undefined
							: "Enter a valid email address",
				}),
			userName: () =>
				cli.text({
					initialValue: "Clinic Admin",
					message: "User name",
					placeholder: "Clinic Admin",
					validate: (value?: string) =>
						(value ?? "").trim().length === 0 ? "Name is required" : undefined,
				}),
			userPassword: () =>
				cli.password({
					message: "User password",
					validate: (value?: string) =>
						(value ?? "").length < 8
							? "Password must be at least 8 characters"
							: undefined,
				}),
		},
		{
			onCancel: () => {
				cli.cancel("Seed cancelled.");
				process.exit(0);
			},
		},
	);

	return {
		org: {
			name: input.orgName.trim(),
			slug: input.orgSlug.trim().toLowerCase(),
		},
		user: {
			email: input.userEmail.trim().toLowerCase(),
			name: input.userName.trim(),
			password: input.userPassword,
		},
	};
}

async function main() {
	const input = await promptInput();

	const user = await pm.run("$global", async () => {
		const users = await pm.management.users.list.run({
			filters: { limit: 100, offset: 0 },
		});

		const existing = users.find(({ email }) => email === input.user.email);
		if (existing) {
			cli.log.info("User already exists");
			return existing;
		}

		const user = await pm.management.users.create.run({
			...input.user,
			role: "tenant_admin",
			spId: null,
		});
		cli.log.info("User created");

		return user;
	});
	cli.log.info(`${user.email} (${user.id})`);

	const tenant = await pm.run("$global", async () => {
		const tenants = await pm.management.tenants.list.run({
			filters: { limit: 50, offset: 0, search: input.org.slug },
		});

		const existing = tenants.find(({ slug }) => slug === input.org.slug);
		if (existing) {
			cli.log.info("Org already exists");
			return { id: existing.id, slug: existing.slug };
		}

		const { tenantId } = await pm.management.tenants.onboard.run({
			tenant: input.org,
			userId: user.id,
		});
		cli.log.info("Org created");

		const created = await pm.management.tenants.get.run({ id: tenantId });
		return { id: created.id, slug: created.slug };
	});
	cli.log.info(`${tenant.slug} (${tenant.id})`);
}

await main()
	.then(async () => {
		cli.outro(`Seed completed!`);
		await pm.$cleanup().catch(() => {});
		process.exit(0);
	})
	.catch(async (err) => {
		cli.cancel(err instanceof Error ? err.message : String(err));
		await pm.$cleanup().catch(() => {});
		process.exit(1);
	});
