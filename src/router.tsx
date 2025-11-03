// src/router.tsx
import { createRouter as createTanStackRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

// Keep the original function for backwards compatibility
export function createRouter() {
	console.log("Creating router...");
	const router = createTanStackRouter({
		routeTree,
		scrollRestoration: true,
	})

	return router
}

// Add the getRouter function expected by TanStack Start
export function getRouter() {
	console.log("Getting router...");
	return createRouter();
}

declare module '@tanstack/react-router' {
	interface Register {
		router: ReturnType<typeof createRouter>
	}
}
