import { Platform } from "@aspen-os/platform/client";

import { env } from "../env";

export const p = Platform.create(
  {
    auth: {
      baseURL:
        typeof window === "undefined"
          ? `${env.PUBLIC_WEB_SSL ? "https" : "http"}://${env.PUBLIC_WEB_DOMAIN}:${env.PUBLIC_WEB_PORT}`
          : window.location.origin,
      fetchOptions: {
        credentials: "include",
      },
    },
    logs: {},
    rpc: {},
  },
  [],
);
