type JSType = "boolean" | "string" | "number" | "object" | (new (...args: any[]) => any);
export type Type = JSType | "perm_url";

export interface SchemaEntry {
	type: Type;
	label: string;
	hint?: string;
}


/**
 * Schema is a key-value object used to define the types that are expected.
 *
 * Used to provide automatic forms to edit widgets.
 */
export default interface Schema {
	[name: string]: SchemaEntry;
}


function makeEntryFunc(type: Type) {
	return (label: string, hint?: string) => ({
		type: type,
		label: label,
		hint: hint,
	});
}


/**
 * Utility functions for defining Schema entries.
 */
export namespace type {
	export const boolean = makeEntryFunc("boolean");
	export const string = makeEntryFunc("string");
	export const number = makeEntryFunc("number");
	export const object = makeEntryFunc("object");

	/**
	 * Date entry only, no time
	 */
	export const date = makeEntryFunc(Date);

	export const url = makeEntryFunc("string");

	/**
	 * URL, but will ask the user to grant permission to the host when using as
	 * an extension and the URL is blocked by CORS.
	 */
	export const urlPerm = makeEntryFunc("perm_url");

	export const color = makeEntryFunc("string");
}
