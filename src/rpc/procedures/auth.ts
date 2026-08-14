import { base } from "../middlewares/auth";

export const getSession = base.handler(async ({ context }) => {
  const { pm } = await import("@/aspen/server");
  return pm.run("$global", () => pm.auth.service.api.getSession({ headers: context.headers }));
});
