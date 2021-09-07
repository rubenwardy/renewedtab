import { SchemaEntry, Type } from "app/utils/Schema";


export interface FieldProps<T> {
	type: Type,
	name: string;
	value: T;
	schemaEntry: SchemaEntry;
	onChange: (value: T) => void;
}

import { DateField, TextAreaField, TextField, URLField } from "./HTMLFields";
import JSONField from "./JSONField";
import LocationField from "./LocationField";
import ArrayField from "./ArrayField";
import SelectField from "./SelectField";
import EnumSelectField from "./EnumSelectField";
import CheckboxField from "./CheckboxField";
import ImageUploadField from "./ImageUploadField";
import { FeedURLField, HostAllField } from "./HostPermFields";
import { NumberField, UnitNumberField } from "./NumberField";
import { ColorField, ColorPairField } from "./ColorFields";
import QuoteCategoriesField from "./QuoteCategoriesField";
import SubFormField from "./SubFormField";

export interface FieldComponent<T> extends React.FC<FieldProps<T>> {
	noParentLabel?: boolean;
}


export function makeField(type: Type): FieldComponent<any> {
	if (type == Date) {
		return DateField;
	} else if (type == "boolean") {
		return CheckboxField;
	} else if (type == "number") {
		return NumberField;
	} else if (type == "unit_number") {
		return UnitNumberField;
	} else if (type == "json") {
		return JSONField;
	} else if (type == "enum") {
		return EnumSelectField;
	} else if (type == "select") {
		return SelectField;
	} else if (type == "url_feed") {
		return FeedURLField;
	} else if (type == "host_all") {
		return HostAllField;
	} else if (type == "location") {
		return LocationField;
	} else if (type == "url") {
		return URLField;
	} else if (type == "color") {
		return ColorField;
	} else if (type == "color_pair") {
		return ColorPairField;
	} else if (type == "array" || type == "unordered_array") {
		return ArrayField;
	} else if (type == "image") {
		return ImageUploadField;
	} else if (type == "textarea") {
		return TextAreaField;
	} else if (type == "quote_categories") {
		return QuoteCategoriesField;
	} else if (type == "string") {
		return TextField;
	} else if (type == "subform") {
		return SubFormField;
	} else {
		throw new Error(`Unknown schema type ${type.toString()}`);
	}
}

export { default as Form } from "./Form";
