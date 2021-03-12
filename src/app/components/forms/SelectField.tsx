import React, { useState } from "react";
import { Radio, RadioGroup } from "react-radio-group";
import { FieldProps } from ".";

export default function SelectField(props: FieldProps<any>) {
	const Enum: any = props.type;
	const [value, setValue] = useState(props.value);

	function handleChanged(newMode: any) {
		if (props.onChange) {
			props.onChange(getValue(newMode));
			setValue(getValue(newMode));
		}
	}

	function getString(x: any): string {
		if (typeof(x) == "string") {
			return x;
		} else {
			return Enum[x];
		}
	}

	function getValue(x: any): any {
		if (typeof(x) == "string") {
			return Enum[x];
		} else {
			return x;
		}
	}

	const radioModes =
		Object.keys(props.type)
			.filter(value => isNaN(Number(value)))
			.map(x => (
				<div className="field" key={getValue(x)}>
					<Radio value={getValue(x)} /> {getString(x)}
				</div>));

	return (
		<div className="field">
			<label htmlFor={props.name}>{props.schemaEntry.label ?? props.name}</label>

			<RadioGroup name="mode" selectedValue={getValue(value)} onChange={handleChanged}>
				{radioModes}
			</RadioGroup>


			{props.schemaEntry.hint &&
				<p className="text-muted">{props.schemaEntry.hint}</p>}
		</div>);
}
