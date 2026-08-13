import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";

const config = defineConfig({
  build: {
    outDir: ".output",
    rolldownOptions: {
      external: [
        "@aws-sdk/client-rds-data",
        "@electric-sql/pglite",
        "@libsql/client",
        "@libsql/client-wasm",
        "@libsql/client/http",
        "@libsql/client/node",
        "@libsql/client/sqlite3",
        "@libsql/client/web",
        "@libsql/client/ws",
        "@neondatabase/serverless",
        "@planetscale/database",
        "@prisma/client",
        "@tidbcloud/serverless",
        "@upstash/redis",
        "@vercel/postgres",
        "better-sqlite3",
        "expo-sqlite",
        "gel",
        "mysql2",
        "mysql2/promise",
      ],
    },
  },
  envPrefix: ["PUBLIC_"],
  plugins: [
    devtools(),
    nitro({
      preset: "bun",
    }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
  ],
  resolve: {
    tsconfigPaths: true,
  },
});

export default config;
