import React, { ChangeEvent, useState } from "react";
import { FieldProps } from ".";
import RequestHostPermission from "../RequestHostPermission";

export function TextField(props: FieldProps<string>) {
	function handleChange(e: ChangeEvent<HTMLInputElement>) {
		if (props.onChange) {
			props.onChange(e.target.value);
		}
	}

	return (
		<div className="field">
			<label htmlFor={props.name}>{props.schemaEntry.label ?? props.name}</label>
			<input type="text" name={props.name} defaultValue={props.value}
					onChange={handleChange} />

			{props.schemaEntry.hint &&
				<p className="text-muted">{props.schemaEntry.hint}</p>}
		</div>);
}

export function PermURLField(props: FieldProps<string>) {
	const [value, setValue] = useState<string>(props.value);

	function handleChange(e: ChangeEvent<HTMLInputElement>) {
		if (props.onChange) {
			props.onChange(e.target.value);
		}
		setValue(e.target.value);
	}

	let host = "";
	try {
		host = new URL(value).host;
	} catch (e) {
		// ignore
	}

	return (
		<div className="field">
			<label htmlFor={props.name}>{props.schemaEntry.label ?? props.name}</label>
			<input type="url" name={props.name} defaultValue={props.value}
					onChange={handleChange} />

			{props.schemaEntry.hint &&
				<p className="text-muted">{props.schemaEntry.hint}</p>}

			<RequestHostPermission host={host} />
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
		<div className="field">
			<label htmlFor={props.name}>{props.schemaEntry.label ?? props.name}</label>
			<input type="date" name={props.name}
					defaultValue={props.value.toISOString().slice(0, 10)}
					onChange={handleChange} />
			{props.schemaEntry.hint &&
				<p className="text-muted">{props.schemaEntry.hint}</p>}
		</div>);
}

export function URLField(props: FieldProps<string>) {
	function handleChange(e: ChangeEvent<HTMLInputElement>) {
		if (props.onChange) {
			props.onChange(e.target.value);
		}
	}

	return (
		<div className="field">
			<label htmlFor={props.name}>{props.schemaEntry.label ?? props.name}</label>
			<input type="url" name={props.name} defaultValue={props.value}
					onChange={handleChange} />

			{props.schemaEntry.hint &&
				<p className="text-muted">{props.schemaEntry.hint}</p>}
		</div>);
}


export function ColorField(props: FieldProps<string>) {
	function handleChange(e: ChangeEvent<HTMLInputElement>) {
		if (props.onChange) {
			props.onChange(e.target.value);
		}
	}

	return (
		<div className="field">
			<label htmlFor={props.name}>{props.schemaEntry.label ?? props.name}</label>
			<input type="color" name={props.name} defaultValue={props.value}
					onChange={handleChange} />

			{props.schemaEntry.hint &&
				<p className="text-muted">{props.schemaEntry.hint}</p>}
		</div>);
}
