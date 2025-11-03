// debug-app.js
console.log("Starting debug script...");

// Check TanStack versions
try {
	const routerPackage = require('@tanstack/react-router/package.json');
	const startPackage = require('@tanstack/react-start/package.json');

	console.log('TanStack Router version:', routerPackage.version);
	console.log('TanStack Start version:', startPackage.version);

	// Check if versions are compatible
	console.log('Are versions identical?', routerPackage.version === startPackage.version);

	// Try to check the router function
	try {
		const router = require('./src/router');
		console.log('Router export keys:', Object.keys(router));
		console.log('createRouter is a function?', typeof router.createRouter === 'function');
	} catch (routerError) {
		console.error('Error importing router:', routerError);
	}

	// Check if the generated route tree is valid
	try {
		const routeTree = require('./src/routeTree.gen');
		console.log('Route tree export keys:', Object.keys(routeTree));
	} catch (routeTreeError) {
		console.error('Error importing route tree:', routeTreeError);
	}

} catch (error) {
	console.error('Error checking packages:', error);
}