import { os } from "@orpc/server";

export const base = os.$context<{
	headers: Headers;
}>();

export const authed = base.use(async ({ context, next }) => {
	const headers = context.headers;
	const { pm } = await import("#/aspen/server");

	const session = await pm.run("$global", () =>
		pm.auth.service.api.getSession({ headers }),
	);
	if (!session) {
		throw new Error("Unauthorized");
	}

	const ctx = { ...context, pm, session };
	return next({ context: ctx });
});
