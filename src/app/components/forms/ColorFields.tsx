import React, { ChangeEvent, useEffect, useState } from "react";
import { FieldProps } from ".";


export function ColorField(props: FieldProps<string>) {
	const [value, setValue] = useState<string>(props.value ?? "");
	useEffect(() => setValue(props.value), [props.value]);

	return (
		<input type="color" name={props.name} value={value}
			onChange={e => setValue(e.target.value)}
			onBlur={() => {
				if (value != props.value) {
					props.onChange(value);
				}
			}} />);
}


export interface ColorPair {
	one: string;
	two: string;
}

export function ColorPairField(props: FieldProps<ColorPair>) {
	const [value, setValue] = useState<ColorPair>(props.value ?? { one: "", two: "" });

	function handleChange(e: ChangeEvent<HTMLInputElement>, idx: number) {
		if (idx == 0) {
			setValue({
				...value,
				one: e.target.value,
			});
		} else {
			setValue({
				...value,
				two: e.target.value,
			});
		}
	}

	function handleBlur() {
		props.onChange({ ...value });
	}

	return (
		<>
			<input type="color" className="mr-2" name={props.name + ""} value={value.one}
				onChange={(e) => handleChange(e, 0)} onBlur={handleBlur} />
			<input type="color" name={props.name + "-2"} value={props.value.two}
				onChange={(e) => handleChange(e, 1)} onBlur={handleBlur} />
		</>);
}
