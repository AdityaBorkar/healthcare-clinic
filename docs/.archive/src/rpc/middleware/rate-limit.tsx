import { base } from ".";

export const rateLimitMiddleware = base.middleware(({ context, next }) => {
	return next({ context });
});
