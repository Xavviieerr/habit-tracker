import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
	plugins: [tsconfigPaths()],
	test: {
		environment: "jsdom",
		globals: true,
		setupFiles: "./tests/setup.ts",
		coverage: {
			provider: "v8",
			reporter: ["text", "html", "lcov"],
			// Integration tests own component coverage; lib coverage belongs to unit tests.
			include: ["src/components/**"],
			thresholds: {
				lines: 80,
				functions: 80,
				branches: 80,
				statements: 80,
			},
		},
	},
});
