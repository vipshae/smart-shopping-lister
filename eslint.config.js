// @ts-check

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";
import prettierConfig from "eslint-config-prettier";

export default defineConfig(
  // Global ignores - must be first
  {
    ignores: [
      "**/.svelte-kit/**",
      "**/build/**",
      "**/dist/**",
      "**/.vercel/**",
      "**/.output/**",
      "**/node_modules/**",
      "**/.env",
      "**/.env.*",
      "**/pnpm-lock.yaml",
      "**/package-lock.json",
      "**/yarn.lock",
      "**/playwright.config.ts",
      "**/vite.config.js",
      "**/svelte.config.js",
      "**/tests/**",
      "**/test-results/**",
    ],
  },
  // Base config for all files
  eslint.configs.recommended,
  // TypeScript config for TypeScript files only
  tseslint.configs.recommendedTypeChecked,
  // JavaScript files without type checking
  {
    files: ["**/*.js", "**/*.cjs", "**/*.mjs"],
    extends: [tseslint.configs.disableTypeChecked],
  },
  // Prettier config (must be last to override other formatting rules)
  prettierConfig,
);
