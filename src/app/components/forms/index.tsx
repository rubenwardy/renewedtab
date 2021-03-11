import { SchemaEntry, Type } from "app/utils/Schema";


export interface FieldProps<T> {
	name: string;
	value: T;
	schemaEntry: SchemaEntry;
	onChange?: (value: T) => void;
}

import { DateField, PermURLField, TextField } from "./Field";
import JSONField from "./JSONField";
import LocationField from "./LocationField";
import ArrayField from "./ArrayField";

export function makeField(type: Type): React.FC<FieldProps<any>> {
	if (type == Date) {
		return DateField;
	} else if (type == "object") {
		return JSONField;
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
