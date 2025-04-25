import { defineConfig, loadEnv, type Rollup, type UserConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { minifyJsonPlugin } from "./src/plugins/vite/vite-minify-json-plugin";
import { viteStaticCopy } from "vite-plugin-static-copy"; // <-- import the plugin

export const defaultConfig: UserConfig = {
  plugins: [tsconfigPaths(), minifyJsonPlugin(["images", "battle-anims"], true)],
  clearScreen: false,
  appType: "mpa",
  build: {
    chunkSizeWarningLimit: 10000,
    minify: "esbuild",
    sourcemap: false,
    rollupOptions: {
      onwarn(warning: Rollup.RollupLog, defaultHandler: (warning: string | Rollup.RollupLog) => void) {
        if (warning.code === "MODULE_LEVEL_DIRECTIVE") {
          return;
        }
        defaultHandler(warning);
      },
    },
  },
};

export default defineConfig(({ mode }) => {
  const envPort = Number(loadEnv(mode, process.cwd()).VITE_PORT);

  return {
    ...defaultConfig,
    base: '/pokerogue/', // <-- Add this line for GitHub Pages
    esbuild: {
      pure: mode === "production" ? ["console.log"] : [],
      keepNames: true,
    },
    server: {
      port: !Number.isNaN(envPort) ? envPort : 8000,
    },
    plugins: [
      ...defaultConfig.plugins,
      viteStaticCopy({
        targets: [
          {
            src: 'public/config.json', // <-- Copy `config.json` to the build folder
            dest: '.',
          },
        ],
      }),
    ],
  };
});
