import React from "react";
import { ChangeEvent } from "react";
import { FieldProps } from ".";

export function UnitNumberField(props: FieldProps<number>) {
	function handleChange(e: ChangeEvent<HTMLInputElement>) {
		if (props.onChange && parseFloat(e.target.value)) {
			props.onChange(parseFloat(e.target.value));
		}
	}

	return (
		<div className="field-group unit-field">
			<input type="number" name={props.name} defaultValue={props.value}
					size={10} onChange={handleChange} />
			<span className="unit">{props.schemaEntry.unit}</span>
		</div>);
}
