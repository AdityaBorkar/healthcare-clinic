import { env } from "#/env";

const SUBDOMAIN_PATTERN = /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;

/**
 * Extracts the tenant subdomain from a request Host header by stripping the
 * app's apex domain (PUBLIC_WEB_DOMAIN). Returns null when the request is
 * hitting the apex domain itself or a host we don't serve.
 *
 * @example
 *   ("acme.localhost:3000", "localhost") => "acme"
 *   ("localhost:3000", "localhost")       => null
 *   ("acme.example.com", "example.com")   => "acme"
 *   ("example.com", "example.com")        => null
 */
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

export function getOrganizationSlug(headers: Headers): string | null {
	const host = headers.get("host");
	return host ? extractSubdomain(host, env.PUBLIC_WEB_DOMAIN) : null;
}

export function requireOrganizationSlug(headers: Headers): string {
	const slug = getOrganizationSlug(headers);
	if (!slug) {
		throw new Error("This request is not associated with a workspace");
	}
	return slug;
}
