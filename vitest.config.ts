import { loadEnv } from "vite"
import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    clearMocks: true,
    coverage: {
      exclude: ["**/*.test.ts", "src/index.ts"],
      include: ["src/**"],
      provider: "v8",
    },
    env: loadEnv("test", process.cwd(), ""),
    include: ["**/*.test.ts"],
    mockReset: true,
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },
    restoreMocks: true,
  },
})
