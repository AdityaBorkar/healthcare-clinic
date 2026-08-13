import { os } from "@orpc/server";

import type { RpcContext } from "../context";

export const base = os.$context<RpcContext>();

export const authed = base.use(async ({ context, next }) => {
  const { p } = await import("@/aspen/server");
  const session = await p.run("$global", () =>
    p.auth.service.api.getSession({ headers: context.headers }),
  );
  if (!session) {
    throw new Error("Unauthorized");
  }
  return next({ context: { ...context, session } });
});

export async function resolveUser(headers: Headers) {
  const { p } = await import("@/aspen/server");
  return p.run("$global", () => p.auth.service.api.getSession({ headers }));
}
