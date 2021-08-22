import { myFormatMessage } from "app/locale/MyMessageDescriptor";
import { enumToValue } from "app/utils/enum";
import React, { useState } from "react";
import { useIntl } from "react-intl";
import { Radio, RadioGroup } from "react-radio-group";
import { FieldProps } from ".";

export default function EnumSelectField(props: FieldProps<any>) {
	const Enum = props.schemaEntry.values;
	const [value, setValue] = useState(props.value);
	const intl = useIntl();

	function handleChanged(newMode: any) {
		if (props.onChange) {
			props.onChange(getValue(newMode));
		}
		setValue(getValue(newMode));
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

	function getValue(x: any): any {
		if (typeof(x) == "string") {
			return Enum[x];
		} else {
			return x;
		}
	}

	const enumValues = Object.keys(Enum).filter(value => isNaN(Number(value)));
	if (enumValues.length < 3) {
		const radioModes =
			enumValues
				.map(x => (
					<div className="field" key={getValue(x)}>
						<Radio value={getValue(x)} /> {getString(x)}
					</div>));
		return (
			<RadioGroup name="mode" selectedValue={getValue(value)} onChange={handleChanged}>
				{radioModes}
			</RadioGroup>);
	} else {
		const radioModes =
			enumValues
				.map(x => (
					<option className="field" key={getValue(x)} value={getValue(x)}>
						{getString(x)}
					</option>));
		return (
			<select name="mode" value={getValue(value)} onChange={(e) => handleChanged(e.target.value)}>
				{radioModes}
			</select>);
	}
}
