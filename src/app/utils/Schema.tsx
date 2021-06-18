import { MessageDescriptor } from "@formatjs/intl";
import { IntlShape } from "react-intl";

type JSType = "boolean" | "string" | "number" | "object" | (new (...args: any[]) => any);
export type Type = JSType | "host_url" | "host_all" | "location" |
	"image_upload" | "array" | "unordered_array" | "json" | "url" |
	"color" | "color_pair" | "image" | "unit_number" | "textarea" | "quote_categories";


export type AutocompleteList = {label: string, value: string};

export interface SchemaEntry {
	type: Type;
	subschema?: Schema;
	label: MessageDescriptor;
	hint?: MessageDescriptor;
	unit?: string;
	autocomplete?: (intl: IntlShape) => Promise<AutocompleteList[]>;
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

function makeAutocompletedTypeFunc(type: Type) {
	return (label: MessageDescriptor, hint?: MessageDescriptor,
			autocomplete?: (intl: IntlShape) => Promise<{label: string, value: string}[]>) => (
		{ type, label, hint, autocomplete }
	);
}


/**
 * Utility functions for defining Schema entries.
 */
export namespace type {
	export const boolean = makeTypeFunc("boolean");
	export const string = makeTypeFunc("string");
	export const textarea = makeTypeFunc("textarea");
	export const number = makeTypeFunc("number");
	export const json = makeTypeFunc("json");

	export const unit_number = (label: MessageDescriptor, unit: string, hint?: MessageDescriptor): SchemaEntry => ({
		type: "unit_number",
		label: label,
		hint: hint,
		unit: unit,
	});

	/**
	 * Date entry only, no time
	 */
	export const date = makeTypeFunc(Date);

	export const url = makeTypeFunc("url");

	/**
	 * URL, but will ask the user to grant host permissions when using as
	 * an extension and the URL is blocked by CORS.
	 */
	export const urlPerm = makeAutocompletedTypeFunc("host_url");

	export const color = makeTypeFunc("color");
	export const colorPair = makeTypeFunc("color_pair");

	export const location = makeTypeFunc("location");

	export const image_upload = makeTypeFunc("image_upload");

	export const image = makeTypeFunc("image");

	export const booleanHostPerm = makeTypeFunc("host_all");

	/**
	 * enumType: The TypeScript enum object
	 */
	export const selectEnum = (enumType: any, // eslint-disable-line
			label: MessageDescriptor, hint?: MessageDescriptor): SchemaEntry => ({
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
	export const array = (subschema: Schema, label: MessageDescriptor,
			hint?: MessageDescriptor): SchemaEntry => ({
		type: "array",
		subschema: subschema,
		label: label,
		hint: hint,
	});

	/**
	 * Note: the values in the array MUST have an `id` field which is set to a
	 * large random number. This is used for React keys.
	 * You shouldn't include `id` in the subschema, as you don't want users to
	 * edit it.
	 */
	 export const unorderedArray = (subschema: Schema, label: MessageDescriptor,
			hint?: MessageDescriptor): SchemaEntry => ({
		type: "unordered_array",
		subschema: subschema,
		label: label,
		hint: hint,
	});

	export const quoteCategories = makeTypeFunc("quote_categories");
}
