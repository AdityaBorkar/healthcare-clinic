import { base } from ".";

export const loggingMiddleware = base.middleware(({ context, next }) => {
	return next({ context });
});
