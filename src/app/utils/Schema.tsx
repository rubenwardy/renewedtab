import { MessageDescriptor } from "@formatjs/intl";

type JSType = "boolean" | "string" | "number" | "object" | (new (...args: any[]) => any);
export type Type = JSType | "host_url" | "host_all" | "location" |
	"image_upload" | "array" | "json" | "url" | "color" | "image" |
	"unit_number";


export interface SchemaEntry {
	type: Type;
	subschema?: Schema;
	label: MessageDescriptor;
	hint?: MessageDescriptor;
	unit?: string;
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
	return (label: MessageDescriptor, hint?: MessageDescriptor) => ({
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
	export const json = makeTypeFunc("json");

	export const unit_number = (label: MessageDescriptor, unit: string, hint?: MessageDescriptor) => ({
		type: "unit_number",
		label: label,
		hint: hint,
		unit: unit,
	} as SchemaEntry);

	/**
	 * Date entry only, no time
	 */
	export const date = makeTypeFunc(Date);

	export const url = makeTypeFunc("url");

	/**
	 * URL, but will ask the user to grant host permissions when using as
	 * an extension and the URL is blocked by CORS.
	 */
	export const urlPerm = makeTypeFunc("host_url");

	export const color = makeTypeFunc("color");

	export const location = makeTypeFunc("location");

	export const image_upload = makeTypeFunc("image_upload");

	export const image = makeTypeFunc("image");

	export const booleanHostPerm = makeTypeFunc("host_all");

	/**
	 * enumType: The TypeScript enum object
	 */
	export const selectEnum = (enumType: any, label: MessageDescriptor, hint?: MessageDescriptor) => ({
		type: enumType,
		label: label,
		hint: hint,
	});

	/**
	 * Note: the values in the array MUST have an `id` field which is set to a
	 * large random number. This is used for React keys.
	 * You shouldn't include `id` in the subschema, as you don't want users to
	 * edit it.
	 */
	export const array = (subschema: Schema, label: MessageDescriptor, hint?: MessageDescriptor) => ({
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
