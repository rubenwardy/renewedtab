import React, { ChangeEvent } from "react";
import { FieldProps } from ".";

export function TextField(props: FieldProps<string>) {
	function handleChange(e: ChangeEvent<HTMLInputElement>) {
		if (props.onChange) {
			props.onChange(e.target.value);
		}
	}

	return (
		<input type="text" name={props.name} defaultValue={props.value}
				onChange={handleChange} />);
}

export function DateField(props: FieldProps<Date>) {
	function handleChange(e: ChangeEvent<HTMLInputElement>) {
		if (props.onChange) {
			const ms = Date.parse(e.target.value);
			if (!Number.isNaN(ms)) {
				props.onChange(new Date(ms));
			}
		}
	}

	return (
		<input type="date" name={props.name}
				defaultValue={props.value.toISOString().slice(0, 10)}
				onChange={handleChange} />);
}

export function URLField(props: FieldProps<string>) {
	function handleChange(e: ChangeEvent<HTMLInputElement>) {
		if (props.onChange) {
			props.onChange(e.target.value);
		}
	}

	return (
		<input type="url" name={props.name} defaultValue={props.value}
				onChange={handleChange} />);
}


export function TextAreaField(props: FieldProps<string>) {
	function handleChange(e: ChangeEvent<HTMLTextAreaElement>) {
		if (props.onChange) {
			props.onChange(e.target.value);
		}
	}

	return (
		<textarea name={props.name} defaultValue={props.value}
				onChange={handleChange} className="fullwidth" />);
}
