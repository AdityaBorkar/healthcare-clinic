import { createEnv } from "@t3-oss/env-core";
import {
	boolean,
	minLength,
	minValue,
	number,
	parseBoolean,
	pipe,
	string,
	toNumber,
	unknown,
} from "valibot";

declare const window: Window & typeof globalThis;

export const env = createEnv({
	client: {
		PUBLIC_WEB_DOMAIN: pipe(string(), minLength(1)),
		PUBLIC_WEB_PORT: pipe(unknown(), toNumber(), number()),
		PUBLIC_WEB_SSL: pipe(unknown(), parseBoolean(), boolean()),
	},
	clientPrefix: "PUBLIC_",
	emptyStringAsUndefined: true,
	runtimeEnv: typeof window === "undefined" ? process.env : import.meta.env,
	server: {
		AUTH_SECRET: pipe(string(), minLength(1)),
		DB_HOST: pipe(string(), minLength(1)),
		DB_PASSWORD: pipe(string(), minLength(1)),
		DB_PORT: pipe(unknown(), toNumber(), number(), minValue(1)),
		DB_SSL: pipe(unknown(), parseBoolean(), boolean()),
		DB_USER: pipe(string(), minLength(1)),
		GOOGLE_CLIENT_ID: pipe(string(), minLength(1)),
		GOOGLE_CLIENT_SECRET: pipe(string(), minLength(1)),
		// Consumed by the Aspen platform via process.env (log service name);
		// validated here so misconfiguration fails fast at startup.
		OTEL_SERVICE_NAME: pipe(string(), minLength(1)),
		STORAGE_ACCESS_KEY: pipe(string(), minLength(1)),
		STORAGE_BUCKET: pipe(string(), minLength(1)),
		STORAGE_ENDPOINT: pipe(string(), minLength(1)),
		STORAGE_FORCE_PATH_STYLE: pipe(unknown(), parseBoolean(), boolean()),
		STORAGE_REGION: pipe(string(), minLength(1)),
		STORAGE_SECRET_KEY: pipe(string(), minLength(1)),
	},
});

export const BASE_URL = `${env.PUBLIC_WEB_SSL ? "https://" : "http://"}${env.PUBLIC_WEB_DOMAIN}${env.PUBLIC_WEB_PORT ? `:${env.PUBLIC_WEB_PORT}` : ""}`;
