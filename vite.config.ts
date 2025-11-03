/// <reference types="vitest/config" />
// vite.config.ts
import { defineConfig } from 'vite';
import tsConfigPaths from 'vite-tsconfig-paths';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
	server: {
		port: 3000
	},
	plugins: [tsConfigPaths(),
	// Basic TanStack Start configuration with custom React plugin configuration
	tanstackStart({
		customViteReactPlugin: true
	}), viteReact(), tailwindcss()],
	test: {
		projects: [{
			extends: true,
			plugins: [],
		}]
	}
});