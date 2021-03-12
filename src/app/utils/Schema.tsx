type JSType = "boolean" | "string" | "number" | "object" | (new (...args: any[]) => any);
export type Type = JSType | "perm_url" | "location" | "image_upload" | "array";

export interface SchemaEntry {
	type: Type;
	subschema?: Schema;
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


function makeTypeFunc(type: Type) {
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
	export const boolean = makeTypeFunc("boolean");
	export const string = makeTypeFunc("string");
	export const number = makeTypeFunc("number");
	export const object = makeTypeFunc("object");

	/**
	 * Date entry only, no time
	 */
	export const date = makeTypeFunc(Date);

	export const url = makeTypeFunc("string");

	/**
	 * URL, but will ask the user to grant host permissions when using as
	 * an extension and the URL is blocked by CORS.
	 */
	export const urlPerm = makeTypeFunc("perm_url");

	export const color = makeTypeFunc("string");

	export const location = makeTypeFunc("location");

	export const image_upload = makeTypeFunc("image_upload");

	/**
	 * Note: the values in the array MUST have an `id` field which is set to a
	 * large random number. This is used for React keys.
	 * You shouldn't include `id` in the subschema, as you don't want users to
	 * edit it.
	 */
	export const array = (subschema: Schema, label: string, hint?: string) => ({
		type: "array",
		subschema: subschema,
		label: label,
		hint: hint,
	});
}


export interface Location {
	name: string;
	latitude: number;
	longitude: number;
}
