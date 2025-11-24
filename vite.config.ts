import { defineConfig, type PluginOption } from "vite";
import type { OutputChunk } from "rollup";
import react from "@vitejs/plugin-react-swc";

const chunkInsightPlugin = (): PluginOption => ({
  // I log the largest bundles so I can validate chunk size spikes quickly.
  name: "chunk-insight",
  apply: "build",
  generateBundle(_, bundle) {
    const chunkSizes = Object.values(bundle)
      .filter((item): item is OutputChunk => item.type === "chunk")
      .map((chunk) => ({
        name: chunk.name,
        sizeKB: chunk.code.length / 1024,
      }))
      .sort((a, b) => b.sizeKB - a.sizeKB)
      .slice(0, 3);

    if (chunkSizes.length) {
      console.info("[chunk-insight] Largest chunks detected:");
      chunkSizes.forEach(({ name, sizeKB }) => {
        console.info(` - ${name}: ${sizeKB.toFixed(2)}kb`);
      });
    }
  },
});

export default defineConfig({
  plugins: [chunkInsightPlugin(), react()],
  build: {
    chunkSizeWarningLimit: 1500,
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.ts",
    css: true,
  },
});
