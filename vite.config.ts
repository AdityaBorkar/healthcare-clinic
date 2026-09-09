import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";

const config = defineConfig({
	build: {
		outDir: ".output",
	},
	envPrefix: ["PUBLIC_"],
	plugins: [
		devtools(),
		nitro({ preset: "bun" }),
		tailwindcss(),
		tanstackStart(),
		viteReact(),
	],
	resolve: {
		tsconfigPaths: true,
	},
});

export default config;
