import { os } from "@orpc/server";

import { requireOrganizationSlug } from "../utils/subdomain";
import { resolveTenantDatabaseName } from "../utils/workspace-organization";

export const base = os.$context<{
	headers: Headers;
}>();

export const scopedAuthMiddleware = base.use(async ({ context, next }) => {
	const headers = context.headers;
	const { pm } = await import("#/aspen/server");

	const session = await pm.run("$global", () =>
		pm.auth.service.api.getSession({ headers }),
	);
	if (!session) {
		throw new Error("Unauthorized");
	}

	const organizationSlug = requireOrganizationSlug(headers);
	const tenantId = await resolveTenantDatabaseName(headers);
	const actorId = session.user.id;

	const ctx = { ...context, actorId, organizationSlug, pm, session, tenantId };

	return next({ context: ctx });
});
