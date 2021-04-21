import React, { ChangeEvent } from "react";
import { FieldProps } from ".";


export function ColorField(props: FieldProps<string>) {
	function handleChange(e: ChangeEvent<HTMLInputElement>) {
		if (props.onChange) {
			props.onChange(e.target.value);
		}
	}

	return (
		<input type="color" name={props.name} defaultValue={props.value}
			onChange={handleChange} />);
}


export interface ColorPair {
	one: string;
	two: string;
}

export function ColorPairField(props: FieldProps<ColorPair>) {
	function handleChange(e: ChangeEvent<HTMLInputElement>, idx: number) {
		if (props.onChange) {
			if (idx == 0) {
				props.value.one = e.target.value;
			} else {
				props.value.two = e.target.value;
			}

			props.onChange({ ...props.value });
		}
	}

	return (
		<>
			<input type="color" name={props.name} defaultValue={props.value.one}
				className="mr-2" onChange={(e) => handleChange(e, 0)} />
			<input type="color" name={props.name} defaultValue={props.value.two}
				onChange={(e) => handleChange(e, 1)} />
		</>);
}
