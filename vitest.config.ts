import { defineConfig } from "vitest/config"
import path from "path"

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    environment: "jsdom",
    exclude: ["**/node_modules/**", "**/.git/**", "**/.worktrees/**"],
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
  },
})
