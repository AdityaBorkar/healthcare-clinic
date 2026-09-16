import { os } from "@orpc/server";

import { env } from "#/env";

export const base = os.$context<{
	headers: Headers;
}>();

export const scopedAuthMiddleware = base.use(async ({ context, next }) => {
	const headers = context.headers;
	const { pm } = await import("#/aspen/server");

	const session = await pm.run("$global", () =>
		pm.auth.service.api.getSession({ headers }),
	);
	if (!session) {
		throw new Error("Unauthorized");
	}

	const organizationSlug = requireOrganizationSlug(headers);
	const { databaseName } = await pm.run("$global", () =>
		pm.management.tenants.resolveDatabase.run({ slug: organizationSlug }),
	);
	const actorId = session.user.id;

	const ctx = {
		...context,
		actorId,
		organizationSlug,
		pm,
		session,
		tenantId: databaseName,
	};

	return next({ context: ctx });
});

const SUBDOMAIN_PATTERN = /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;

export function extractSubdomain(
	host: string,
	appDomain: string,
): string | null {
	const hostname = host.split(":")[0]?.toLowerCase() ?? "";
	const suffix = `.${appDomain.toLowerCase()}`;
	if (!hostname.endsWith(suffix)) {
		return null;
	}
	const subdomain = hostname.slice(0, -suffix.length);
	return subdomain.length > 0 && SUBDOMAIN_PATTERN.test(subdomain)
		? subdomain
		: null;
}

export function requireOrganizationSlug(headers: Headers): string {
	const host = headers.get("host");
	const slug = host ? extractSubdomain(host, env.PUBLIC_WEB_DOMAIN) : null;
	if (!slug) {
		throw new Error("This request is not associated with a workspace");
	}
	return slug;
}
