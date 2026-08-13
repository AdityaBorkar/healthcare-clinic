import { env } from "@/env";
import { UpdateOrganizationInputSchema } from "@/schemas/organizations";
import { authed, base } from "../middlewares/auth";

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
  if (!hostname.endsWith(suffix)) return null;
  const subdomain = hostname.slice(0, -suffix.length);
  return subdomain.length > 0 && SUBDOMAIN_PATTERN.test(subdomain)
    ? subdomain
    : null;
}

export const getOrganizationBySubdomain = base.handler(async ({ context }) => {
  const host = context.headers.get("host");
  if (!host) return { organization: null, subdomain: null };

  const subdomain = extractSubdomain(host, env.PUBLIC_WEB_DOMAIN);
  if (!subdomain) return { organization: null, subdomain: null };

  const { p } = await import("@/aspen/server");

  return p.run("$global", async () => {
    const result = await p.db.pool.query<{
      created_at: Date;
      id: string;
      logo: string | null;
      metadata: unknown;
      name: string;
      slug: string;
    }>(
      `SELECT id, name, slug, logo, metadata, created_at
         FROM organization
         WHERE slug = $1
         LIMIT 1`,
      [subdomain],
    );

    const row = result.rows[0];
    if (!row) return { organization: null, subdomain };

    return {
      organization: {
        createdAt: row.created_at.toISOString(),
        id: row.id,
        logo: row.logo,
        metadata: row.metadata,
        name: row.name,
        slug: row.slug,
      },
      subdomain,
    };
  });
});

export const listOrganizations = base.handler(async () => {
  const { p } = await import("@/aspen/server");

  return p.run("$global", async () => {
    const result = await p.db.pool.query<{
      id: string;
      logo: string | null;
      name: string;
      slug: string;
    }>(
      `SELECT id, name, slug, logo
         FROM organization
         ORDER BY name ASC`,
    );

    return {
      organizations: result.rows,
    };
  });
});

function getOrganizationSlug(headers: Headers) {
  const host = headers.get("host");
  const organizationSlug = host
    ? extractSubdomain(host, env.PUBLIC_WEB_DOMAIN)
    : null;

  if (!organizationSlug) {
    throw new Error("This request is not associated with a workspace");
  }

  return organizationSlug;
}

/**
 * Resolves the tenant database name for the organization behind the current
 * request so organization module workflows can run inside that tenant's
 * database context.
 */
async function resolveTenantDatabaseName(headers: Headers): Promise<string> {
  const organizationSlug = getOrganizationSlug(headers);

  const { p } = await import("@/aspen/server");

  return p.run("$global", async () => {
    const organization = await p.auth.service.api.getFullOrganization({
      headers,
      query: { organizationSlug },
    });

    if (!organization) throw new Error("Workspace not found");

    const tenant = await p.management.tenants.get.run({
      id: organization.id,
    });
    if (!tenant.databaseName) {
      throw new Error("Workspace database is not configured");
    }

    return tenant.databaseName;
  });
}

type OrganizationModuleRow = {
  accentColor: string;
  address: string | null;
  createdAt: Date;
  email: string | null;
  foundedDate: string | null;
  id: string;
  industry: string | null;
  locale: string;
  logo: string | null;
  metadata: unknown;
  name: string;
  phone: string | null;
  registrationNumber: string | null;
  slug: string;
  status: string;
  taxId: string | null;
  timezone: string;
  updatedAt: Date;
  website: string | null;
};

function toOrganizationDto(org: OrganizationModuleRow) {
  return {
    accentColor: org.accentColor,
    address: org.address,
    createdAt: org.createdAt.toISOString(),
    email: org.email,
    foundedDate: org.foundedDate,
    id: org.id,
    industry: org.industry,
    locale: org.locale,
    logo: org.logo,
    metadata: org.metadata,
    name: org.name,
    phone: org.phone,
    registrationNumber: org.registrationNumber,
    slug: org.slug,
    status: org.status,
    taxId: org.taxId,
    timezone: org.timezone,
    updatedAt: org.updatedAt.toISOString(),
    website: org.website,
  };
}

export const getCurrentOrganization = authed.handler(async ({ context }) => {
  const tenantDatabaseName = await resolveTenantDatabaseName(context.headers);

  const { p } = await import("@/aspen/server");

  const organization = await p.run(tenantDatabaseName, () =>
    p.organization.organizations.get.run({}),
  );

  if (!organization) throw new Error("Workspace organization not found");

  return toOrganizationDto(organization);
});

export const updateCurrentOrganization = authed
  .input(UpdateOrganizationInputSchema)
  .handler(async ({ context, input }) => {
    const tenantDatabaseName = await resolveTenantDatabaseName(context.headers);

    const { p } = await import("@/aspen/server");

    const organization = await p.run(tenantDatabaseName, () =>
      p.organization.organizations.update.run({
        accentColor: input.accentColor,
        address: input.address,
        email: input.email,
        foundedDate: input.foundedDate
          ? new Date(`${input.foundedDate}T00:00:00Z`)
          : undefined,
        industry: input.industry,
        locale: input.locale,
        name: input.name,
        phone: input.phone,
        registrationNumber: input.registrationNumber,
        slug: input.slug,
        taxId: input.taxId,
        timezone: input.timezone,
        website: input.website,
      }),
    );

    return toOrganizationDto(organization);
  });
