import React, { useEffect, useState } from "react";
import { ChangeEvent } from "react";
import { FieldProps } from ".";


export function NumberField(props: FieldProps<number>) {
	const [value, setValue] = useState<string>(props.value.toString() ?? 0);
	useEffect(() => setValue(props.value.toString()), [props.value]);

	function handleBlur(e: ChangeEvent<HTMLInputElement>) {
		if (e.target.checkValidity() && !isNaN(parseFloat(e.target.value))) {
			props.onChange(parseFloat(e.target.value));
		}
	}

	return (
		<input type="number" name={props.name} value={value} size={10}
			min={props.schemaEntry.min} max={props.schemaEntry.max}
			onChange={e => setValue(e.target.value)}
			onBlur={handleBlur} required />);
}


export function UnitNumberField(props: FieldProps<number>) {
	const [value, setValue] = useState<string>(props.value.toString() ?? 0);
	useEffect(() => setValue(props.value.toString()), [props.value]);

	function handleBlur(e: ChangeEvent<HTMLInputElement>) {
		if (e.target.checkValidity() && !isNaN(parseFloat(e.target.value))) {
			props.onChange(parseFloat(e.target.value));
		}
	}

	return (
		<div className="field-group unit-field">
			<input type="number" name={props.name} value={value} size={10}
				min={props.schemaEntry.min} max={props.schemaEntry.max}
				onChange={e => setValue(e.target.value)}
				onBlur={handleBlur} required />
			<span className="unit">{props.schemaEntry.unit}</span>
		</div>);
}
