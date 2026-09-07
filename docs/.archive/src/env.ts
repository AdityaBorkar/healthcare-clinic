import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
	client: {
		VITE_APP_TITLE: z.string().min(1).optional(),
	},
	clientPrefix: "VITE_",
	emptyStringAsUndefined: true,
	runtimeEnv: typeof window === "undefined" ? process.env : import.meta.env,
	server: {
		S3_ACCESS_KEY: z.string().min(1).default("minioadmin"),
		S3_BUCKET: z.string().optional().default("shaun-uploads"),
		S3_ENDPOINT: z.url().optional().default("http://localhost:9000"),
		S3_REGION: z.string().optional().default("us-east-1"),
		S3_SECRET_KEY: z.string().min(1).default("minioadmin"),
		SERVER_URL: z.url().optional(),
	},
});
