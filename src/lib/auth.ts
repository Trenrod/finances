export interface AuthUser {
	login: string; // User's login name
	userKeyPath: string; // 
}

let user: AuthUser | undefined;
let initializingPromise: Promise<AuthUser> | undefined;

export const getAuthUser = async (): Promise<AuthUser> => {
	if (user) return user;
	if (initializingPromise) return initializingPromise;
	initializingPromise = initializeAuthUser();
	return initializingPromise;
}

async function initializeAuthUser(): Promise<AuthUser> {
	// In a real application, you would fetch this information from a secure source
	// For demonstration purposes, we are hardcoding the user details
	const tmpAuthUser: AuthUser = {
		login: "client1",
		userKeyPath: "client1"
	};
	user = tmpAuthUser;
	return user;
}

/**
 * Generates the Redis key path for storing a user's category rule.
 */
export const getCategoryRulePath = (user: AuthUser): string => {
	// user:[userid]:category_rule:[rule uuid]
	return `user:${user.userKeyPath}:category_rule`;
}

/**
 * Generates the Redis key path for storing a user's transaction comments
 */
export const getTransactionCommentPath = (user: AuthUser): string => {
	// user:[userid]:category_rule:[rule uuid]
	return `user:${user.userKeyPath}:transaction_comment`;
}