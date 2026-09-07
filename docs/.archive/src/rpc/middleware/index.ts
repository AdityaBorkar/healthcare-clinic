import { os } from "@orpc/server";

interface BaseContext {
	headers: Headers;
}

interface AppMeta {
	permissions?: string[];
}

export const base = os.$context<BaseContext>().$meta<AppMeta>({});
