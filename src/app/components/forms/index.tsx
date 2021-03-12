import { SchemaEntry, Type } from "app/utils/Schema";


export interface FieldProps<T> {
	type: Type,
	name: string;
	value: T;
	schemaEntry: SchemaEntry;
	onChange?: (value: T) => void;
}

import { DateField, PermURLField, TextField } from "./Field";
import JSONField from "./JSONField";
import LocationField from "./LocationField";
import ArrayField from "./ArrayField";
import SelectField from "./SelectField";
import CheckboxField from "./CheckboxField";

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
	} else if (type == "object") {
		return JSONField;
	} else if (typeof(type) == "object" && isEnumType(type)) {
		return SelectField;
	} else if (type == "perm_url") {
		return PermURLField;
	} else if (type == "location") {
		return LocationField;
	} else if (type == "array") {
		return ArrayField;
	} else {
		return TextField;
	}
}

export { default as Form } from "./Form";
