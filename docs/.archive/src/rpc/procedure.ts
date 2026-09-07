import { base } from "./middleware";
import { authMiddleware } from "./middleware/auth";
import { loggingMiddleware } from "./middleware/logging";
import { rateLimitMiddleware } from "./middleware/rate-limit";

export const PublicProcedure = base
	.use(loggingMiddleware)
	.use(rateLimitMiddleware);

export const AuthProcedure = PublicProcedure.use(authMiddleware);

export type { RpcContext } from "./middleware/auth";
