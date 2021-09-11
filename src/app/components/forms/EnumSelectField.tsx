import { myFormatMessage } from "app/locale/MyMessageDescriptor";
import { enumToString, enumToValue } from "app/utils/enum";
import React, { useState } from "react";
import { useIntl } from "react-intl";
import { FieldProps } from ".";

export default function EnumSelectField(props: FieldProps<string | number>) {
	const Enum = props.schemaEntry.values;
	const [value, setValue] = useState(enumToString(Enum, props.value));
	const intl = useIntl();

	function handleChanged(newMode: string) {
		props.onChange(newMode);
		setValue(newMode);
	}

	function getString(x: any): string {
		const id = enumToValue(Enum, x);

		const descriptor = props.schemaEntry.messages && props.schemaEntry.messages[id];
		if (descriptor) {
			return myFormatMessage(intl, descriptor);
		} else {
			return Enum[id];
		}
	}

	const enumValues = Object.keys(Enum).filter(value => isNaN(Number(value)));
	return (
		<select name={props.name} value={value} onChange={(e) => handleChanged(e.target.value)}>
			{enumValues.map(x => (
				<option className="field" key={x} value={x}>
					{getString(x)}
				</option>))}
		</select>);
}
