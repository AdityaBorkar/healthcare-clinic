import { createFileRoute } from "@tanstack/react-router";

import { isTrustedWebOrigin, pm } from "@/aspen/server";

function corsHeaders(request: Request): Headers {
  const origin = request.headers.get("origin");
  const headers = new Headers();
  if (!origin || !isTrustedWebOrigin(origin)) {
    return headers;
  }
  headers.set("Access-Control-Allow-Credentials", "true");
  headers.set(
    "Access-Control-Allow-Headers",
    request.headers.get("access-control-request-headers") ?? "Content-Type, Authorization",
  );
  headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  headers.set("Access-Control-Allow-Origin", origin);
  headers.set("Vary", "Origin");
  return headers;
}

export const Route = createFileRoute("/api/auth/$")({
  server: {
    handlers: {
      ANY: async ({ request }) => {
        const headers = corsHeaders(request);

        if (request.method === "OPTIONS") {
          return new Response(null, { headers, status: 204 });
        }
        const response = await pm.run("$global", () => pm.auth.fetchHandler(request));
        for (const [key, value] of headers) {
          response.headers.set(key, value);
        }
        return response;
      },
    },
  },
});
