import { ManagementPlane } from "@aspen-os/management";
import { Organization } from "@aspen-os/organization";
import { type IsolatedTenantConfig, IsolatedTenantPlatform } from "@aspen-os/platform/server";

import { env } from "../env";

// Common

const hostname = env.PUBLIC_WEB_DOMAIN;
const protocol = env.PUBLIC_WEB_SSL ? "https" : "http";
const port = env.PUBLIC_WEB_PORT ? `${env.PUBLIC_WEB_PORT}` : "";

export function isTrustedWebOrigin(origin: string): boolean {
  try {
    const candidate = new URL(origin);
    return (
      candidate.protocol === `${protocol}:` &&
      candidate.port === port &&
      (candidate.hostname === hostname || candidate.hostname.endsWith(`.${hostname}`))
    );
  } catch {
    return false;
  }
}

// Units

const auth = {
  advanced: {
    crossSubDomainCookies: {
      domain: hostname === "localhost" ? undefined : `.${hostname}`,
      enabled: hostname !== "localhost",
    },
  },
  baseURL: {
    allowedHosts: [`${protocol}://*.${hostname}${port ? `:${port}` : ""}`],
    fallback: `${protocol}://${hostname}${port ? `:${port}` : ""}`,
    protocol,
  },
  secret: env.AUTH_SECRET,
  session: { expiresIn: 60 * 60 * 24 * 7 },
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
  },
} satisfies IsolatedTenantConfig["auth"];

const kvStore = {} satisfies IsolatedTenantConfig["kvStore"];

const logs = {} satisfies IsolatedTenantConfig["logs"];

const pubsub = {} satisfies IsolatedTenantConfig["pubsub"];

const rpc = {} satisfies IsolatedTenantConfig["rpc"];

const storage = {
  bucket: env.STORAGE_BUCKET,
  provider: {
    credentials: {
      accessKeyId: env.STORAGE_ACCESS_KEY,
      secretAccessKey: env.STORAGE_SECRET_KEY,
    },
    endpoint: env.STORAGE_ENDPOINT,
    forcePathStyle: env.STORAGE_FORCE_PATH_STYLE,
    region: env.STORAGE_REGION,
    type: "s3",
  },
} satisfies IsolatedTenantConfig["storage"];

const db = {
  connection: {
    host: env.DB_HOST,
    password: env.DB_PASSWORD,
    port: Number(env.DB_PORT),
    ssl: env.DB_SSL,
    user: env.DB_USER,
  },
  controlDbName: "control_plane",
  tenantDbPrefix: "tenant_",
} satisfies IsolatedTenantConfig["db"];

// Modules

const management_plane = ManagementPlane.create(undefined);

const organization = Organization.create({ country: "INDIA" });

// Const hr = HumanResources.create();

// Const inventory = Inventory.create({
//   Service_name: "Pharmacy"
// });

// Platform

export const pm = IsolatedTenantPlatform.create({ auth, db, kvStore, logs, pubsub, rpc, storage }, [
  management_plane,
  organization,
]);
