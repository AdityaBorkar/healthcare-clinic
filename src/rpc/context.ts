/**
 * The initial context injected into every oRPC procedure from the HTTP layer.
 * Headers are the only thing the server knows about the incoming request;
 * the session is resolved from them by the auth middleware at runtime.
 */
export interface RpcContext {
  headers: Headers;
}
