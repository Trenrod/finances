/**
 *	Creates a UUID from an object by hashing its JSON representation using SHA-512. 
 * @param obj - Object to create UUID from
 * @returns 
 */
export const createUUIDFromObject = async (obj: object): Promise<string> => {
	const message = JSON.stringify(obj);
	const msgUint8 = new TextEncoder().encode(message); // encode as (utf-8) Uint8Array
	const hashBuffer = await crypto.subtle.digest("SHA-512", msgUint8); // hash the message
	const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
	const hashHex = hashArray
		.map((b) => b.toString(16).padStart(2, "0"))
		.join(""); // convert bytes to hex string
	return hashHex;
}
