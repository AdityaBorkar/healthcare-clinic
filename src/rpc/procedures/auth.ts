import { base } from "../middlewares/auth";

export const getSession = base.handler(async ({ context }) => {
  const { p } = await import("@/aspen/server");
  return p.run("$global", () =>
    p.auth.service.api.getSession({ headers: context.headers }),
  );
});
