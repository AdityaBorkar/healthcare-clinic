import { env } from "#/env";

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
