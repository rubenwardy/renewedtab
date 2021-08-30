import React, { FocusEvent, useEffect, useState } from "react";
import { FieldProps } from ".";

export function TextField(props: FieldProps<string>) {
	const [value, setValue] = useState<string>(props.value ?? "");
	useEffect(() => setValue(props.value), [props.value]);

	return (
		<input type="text" name={props.name} value={value}
				onChange={e => setValue(e.target.value)}
				onBlur={() => {
					if (value != props.value) {
						props.onChange(value);
					}
				}}  />);
}

export function DateField(props: FieldProps<Date>) {
	const [value, setValue] = useState<string>(props.value.toISOString().slice(0, 10) ?? "");
	useEffect(() => setValue(props.value.toISOString().slice(0, 10)), [props.value]);

	function handleBlur() {
		const ms = Date.parse(value);
		if (!Number.isNaN(ms)) {
			props.onChange(new Date(ms));
		}
	}

	return (
		<input type="date" name={props.name}
				value={value}
				onChange={e => setValue(e.target.value)}
				onBlur={handleBlur} />);
}

export function URLField(props: FieldProps<string>) {
	const [value, setValue] = useState<string>(props.value ?? "");
	useEffect(() => setValue(props.value), [props.value]);

	function handleBlur(e: FocusEvent<HTMLInputElement>) {
		if (!e.target.checkValidity()) {
			return;
		}

		props.onChange(value);
	}

	return (
		<input type="url" name={props.name} value={value}
				onChange={e => setValue(e.target.value)}
				onBlur={handleBlur} />);
}


export function TextAreaField(props: FieldProps<string>) {
	const [value, setValue] = useState<string>(props.value ?? "");
	useEffect(() => setValue(props.value), [props.value]);

	return (
		<textarea name={props.name} value={value}
			onChange={e => setValue(e.target.value)}
			onBlur={() => {
				if (value != props.value) {
					props.onChange(value);
				}
			}}
			className="fullwidth" />);
}
