import { defineConfig } from "vite";
import { resolve } from "path";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    dts({
      rollupTypes: false,
      include: ["src/**/*.ts"],
    }),
  ],
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern-compiler",
      },
    },
  },
  build: {
    lib: {
      entry: {
        flowg: resolve(__dirname, "src/index.ts"),
      },
      formats: ["es"],
      name: "FlowG",
      fileName: (_format, entryName) => `${entryName}.js`,
    },
    rollupOptions: {
      output: {
        assetFileNames: "style.[ext]",
        // Dynamic imports produce separate chunks (e.g. gsap-loader, gsap-handlers)
        // so GSAP is only loaded when needed
        chunkFileNames: "chunks/[name]-[hash].js",
      },
    },
    cssCodeSplit: false,
    sourcemap: true,
    minify: "terser",
  },
});
