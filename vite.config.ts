import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact, { reactCompilerPreset } from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";

const config = defineConfig({
  envPrefix: "PUBLIC_",
  plugins: [
    devtools(),
    nitro(),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
    babel({ presets: [reactCompilerPreset()] }),
  ],
  resolve: { tsconfigPaths: true },
  server: {
    fs: {
      allow: [
        "/home/aditya/projects/healthcare-clinic",
        "/home/aditya/projects/aspen-os",
      ],
    },
  },
});

export default config;
