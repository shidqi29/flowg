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
        "flowg-core": resolve(__dirname, "src/index.core.ts"),
        "flowg-pro": resolve(__dirname, "src/index.pro.ts"),
      },
      formats: ["es"],
      name: "FlowG",
      fileName: (_format, entryName) => `${entryName}.js`,
    },
    rollupOptions: {
      external: ["gsap"],
      output: {
        assetFileNames: "style.[ext]",
        chunkFileNames: "[name].js",
        globals: {
          gsap: "gsap",
        },
      },
    },
    cssCodeSplit: false,
    sourcemap: true,
    minify: "terser",
  },
});
