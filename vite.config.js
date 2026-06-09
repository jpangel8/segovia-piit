import { defineConfig } from "vite"
import { resolve } from "path"

export default defineConfig(({ mode }) => ({
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    __MODE__: JSON.stringify(mode),
  },
  build: {
    target: "es2020",
    minify: mode === "production" ? "esbuild" : false,
    sourcemap: mode !== "production",
    cssMinify: mode === "production",
    assetsInlineLimit: 4096,
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        manualChunks: {
          motion: ["motion/mini"],
        },
        assetFileNames: "assets/[name]-[hash][extname]",
        chunkFileNames: "chunks/[name]-[hash].js",
        entryFileNames: "js/[name]-[hash].js",
      },
    },
  },
  server: {
    open: false,
  },
}))
