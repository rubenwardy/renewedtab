import { MessageDescriptor } from "@formatjs/intl";
import { MyMessageDescriptor } from "app/locale/MyMessageDescriptor";
import { IntlShape } from "react-intl";

type JSType = "boolean" | "string" | "number" | "object" | (new (...args: any[]) => any);
export type Type = JSType | "url_feed" | "host_all" | "location" |
	"image_upload" | "array" | "unordered_array" | "json" | "url" |
	"color" | "color_pair" | "image" | "unit_number" | "textarea" |
	"quote_categories" | "enum" | "select";


export type AutocompleteItem = {label: string, value: string};
type Messages = {
	[key in (string | number)]: MyMessageDescriptor;
};

// Used by image_upload type to have different objects with the same key
export type ImageHandle = { key: string };

export interface SchemaEntry {
	type: Type;
	subschema?: Schema;
	label: MessageDescriptor;
	messages?: Messages;
	hint?: MessageDescriptor;
	values?: any;
	unit?: string;
	min?: number;
	max?: number;
	autocomplete?: (intl: IntlShape) => Promise<AutocompleteItem[]>;
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
		type, label, hint,
	});
}

function makeAutocompletedTypeFunc(type: Type) {
	return (label: MessageDescriptor, hint?: MessageDescriptor,
			autocomplete?: (intl: IntlShape) => Promise<{label: string, value: string}[]>) => ({
		type, label, hint, autocomplete
	});
}

function makeSelectFunc(type: Type) {
	return (values: any, messages: (Messages | undefined),
			label: MessageDescriptor, hint?: MessageDescriptor): SchemaEntry => ({
		type, values, messages, label, hint,
	});
}


/**
 * Utility functions for defining Schema entries.
 */
export namespace type {
	export const boolean = makeTypeFunc("boolean");
	export const string = makeTypeFunc("string");
	export const textarea = makeTypeFunc("textarea");
	export const json = makeTypeFunc("json");

	export const number = (label: MessageDescriptor, hint?: MessageDescriptor, min?: number, max?: number): SchemaEntry => ({
		type: "number",
		label, hint, min, max
	});

	export const unit_number = (label: MessageDescriptor, unit: string, hint?: MessageDescriptor, min?: number, max?: number): SchemaEntry => ({
		type: "unit_number",
		label, hint, unit, min, max
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
	export const urlFeed = makeAutocompletedTypeFunc("url_feed");

	export const color = makeTypeFunc("color");
	export const colorPair = makeTypeFunc("color_pair");

	export const location = makeTypeFunc("location");

	export const image_upload = makeTypeFunc("image_upload");

	export const image = makeTypeFunc("image");

	export const booleanHostPerm = makeTypeFunc("host_all");

	/**
	 * enumType: The TypeScript enum object
	 */
	export const selectEnum = makeSelectFunc("enum");

	/**
	 * values: keys to labels
	 */
	export const select = makeSelectFunc("select");

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
