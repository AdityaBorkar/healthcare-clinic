import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import type { RouterClient } from "@orpc/server";
import { createRouterClient } from "@orpc/server";
import { createIsomorphicFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";

import { router } from "@/rpc/router";

const getOrpcClient = createIsomorphicFn()
  .server(() =>
    createRouterClient(router, {
      context: async () => ({ headers: getRequestHeaders() }),
    }),
  )
  .client((): RouterClient<typeof router> => {
    const link = new RPCLink({ url: `${window.location.origin}/api/rpc` });
    return createORPCClient(link);
  });

export const orpc: RouterClient<typeof router> = getOrpcClient();
