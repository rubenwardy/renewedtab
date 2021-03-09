export interface FieldProps<T> {
	name: string;
	value: T;
	label?: string;
	hint?: string;
	onChange?: (value: T) => void;
}

import { Type } from "app/utils/Schema";
import { DateField, PermURLField, TextField } from "./Field";
import { JSONField } from "./JSONField";
import { LocationField } from "./LocationField";

export function makeField(type: Type): React.FC<FieldProps<any>> {
	if (type == Date) {
		return DateField;
	} else if (type == "object") {
		return JSONField;
	} else if (type == "perm_url") {
		return PermURLField;
	} else if (type == "location") {
		return LocationField;
	} else {
		return TextField;
	}
}

export { default as Form } from "./Form";
