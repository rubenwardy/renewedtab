import { SchemaEntry, Type } from "app/utils/Schema";


export interface FieldProps<T> {
	type: Type,
	name: string;
	value: T;
	schemaEntry: SchemaEntry;
	onChange?: (value: T) => void;
}

import { ColorField, DateField, TextField, URLField } from "./HTMLFields";
import JSONField from "./JSONField";
import LocationField from "./LocationField";
import ArrayField from "./ArrayField";
import SelectField from "./SelectField";
import CheckboxField from "./CheckboxField";
import ImageUploadField from "./ImageUploadField";
import { HostAllField, HostURLFIeld } from "./HostPermFields";
import { UnitNumberField } from "./NumberField";

function isEnumType(x: any) {
	const keys = new Set(Object.getOwnPropertyNames(x));
	for (let key of keys) {
		if (!keys.has(x[key].toString())) {
			return false;
		}
	}

	return keys.size > 0;
}

export function makeField(type: Type): React.FC<FieldProps<any>> {
	if (type == Date) {
		return DateField;
	} else if (type == "boolean") {
		return CheckboxField;
	} else if (type == "unit_number") {
		return UnitNumberField;
	} else if (type == "json") {
		return JSONField;
	} else if (typeof(type) == "object" && isEnumType(type)) {
		return SelectField;
	} else if (type == "host_url") {
		return HostURLFIeld;
	} else if (type == "host_all") {
		return HostAllField;
	} else if (type == "location") {
		return LocationField;
	} else if (type == "url") {
		return URLField;
	} else if (type == "color") {
		return ColorField;
	} else if (type == "array") {
		return ArrayField;
	} else if (type == "image") {
		return ImageUploadField;
	} else {
		return TextField;
	}
}

export { default as Form } from "./Form";
