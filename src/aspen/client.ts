import { Framework } from "@aspen-os/framework/client";

import { BASE_URL } from "../env";
import { access_control, roles } from "./auth";

const auth = {
  access_control,
  baseURL: BASE_URL,
  roles,
};

const logs = {}; // satisfies LogConfig;

const rpc = {}; // satisfies RpcConfig;

export const f = Framework.create({ auth, logs, rpc }, {});
