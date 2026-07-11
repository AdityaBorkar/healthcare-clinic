import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import type { RouterClient } from "@orpc/server";
import { createRouterClient } from "@orpc/server";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";
import { createIsomorphicFn } from "@tanstack/react-start";

import { BASE_URL } from "@/env";
import { router } from "@/rpc/router";

const getORPCClient = createIsomorphicFn()
  .server(() =>
    createRouterClient(router, {
      context: () => ({}),
    }),
  )
  .client((): RouterClient<typeof router> => {
    const link = new RPCLink({
      url: `${BASE_URL}/api/rpc`,
    });
    return createORPCClient(link);
  });

const client: RouterClient<typeof router> = getORPCClient();

export const rpc = createTanstackQueryUtils(client);
