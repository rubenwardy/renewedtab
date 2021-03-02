import React, { ChangeEvent } from "react";

interface FieldProps<T> {
	name: string;
	value: T;
	label?: string;
	onChange?: (value: T) => void;
}

export function TextField(props: FieldProps<string>) {
	function handleChange(e: ChangeEvent<HTMLInputElement>) {
		if (props.onChange) {
			props.onChange(e.target.value);
		}
	}

	return (
		<div>
			<label htmlFor={props.name}>{props.label ?? props.name}</label>
			<input type="text" name={props.name} defaultValue={props.value}
					onChange={handleChange} />
		</div>);
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
		<div>
			<label htmlFor={props.name}>{props.label ?? props.name}</label>
			<input type="date" name={props.name}
					defaultValue={props.value.toISOString().slice(0, 10)}
					onChange={handleChange} />
		</div>);
}


export function JSONField(props: FieldProps<Object | any[]>) {
	function handleChange(e: ChangeEvent<HTMLTextAreaElement>) {
		if (props.onChange) {
			props.onChange(JSON.parse(e.target.value));
		}
	}

	return (
		<div>
			<label htmlFor={props.name}>{props.label ?? props.name}</label>
			<textarea name={props.name}
					defaultValue={JSON.stringify(props.value)}
					onChange={handleChange} />
		</div>);
}

export type Type = string | (new (...args: any[]) => any);

export function makeField(type: Type): React.FC<FieldProps<any>> {
	if (type == Date) {
		return DateField;
	} else if (type == "object") {
		return JSONField;
	} else {
		return TextField;
	}
}

export function makeFieldForValue(value: any): React.FC<FieldProps<any>> {
	let type = typeof(value);
	if (type == "object") {
		if (value instanceof Date) {
			return makeField(Date);
		}
	}
	return makeField(type);;
}
