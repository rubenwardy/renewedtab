import React, { ChangeEvent, ChangeEventHandler, useState } from "react";

function getInputInfo(key: string, value: any): [string, string] {
	if (value instanceof Date) {
		const ret = (value as Date).toISOString().slice(0, 10);
		console.log(ret);
		return ["date", ret];
	} else if (value instanceof String) {
		return ["text", value.toString()];
	} else if (value instanceof Number) {
		return ["number", value.toString()];
	} else if (value instanceof Array || value instanceof Object || value instanceof Map) {
		return ["textarea", JSON.stringify(value)];
	} else {
		console.error(`Unknown type for ${key}`, value);
		return ["text", value.toString()];
	}
}

interface FieldProps {
	name: string;
	value: any;
	label?: string;

	onChange?: (value: any) => void;
}

export function Field(props: FieldProps) {
	const [type, value] = getInputInfo(props.name, props.value);

	function handleChange(e: ChangeEvent<HTMLElement>) {
		if (!props.onChange) {
			return;
		}

		let value;
		if (e instanceof HTMLTextAreaElement) {
			value = (e.target as HTMLTextAreaElement).value;
		} else {
			value = (e.target as HTMLInputElement).value;
		}
		props.onChange(value);
	}

	const label = (<label htmlFor={props.name}>{props.label ?? props.name}</label>);
	let field;
	if (type == "textarea") {
		field = (<textarea name={props.name} value={value} onChange={handleChange} />);
	} else {
		field = (<input type={type} name={props.name} value={value} onChange={handleChange} />);
	}

	return (<div>{label}{field}</div>);
}


interface WidgetProps{
	className?: string;
	type: string;
	props: { [key: string]: any };
	children?: string|JSX.Element|(string|JSX.Element)[];
}

export function Widget(props: WidgetProps) {
	const [visible, setVisible] = useState(false);

	if (visible) {
		function handleChange(key: string, e: any) {
			console.log(`${key} changed`);
			props.props[key] = e.target.value;
		}

		const inner = Object.entries(props.props).map(([key, value]) =>
				<Field key={key} name={key} value={value} onChange={(val: any) => {props.props[key] = val;}} />);

		return (<div className="widget panel panel-editing">
			<a className="btn" onClick={() => setVisible(false)}>x</a>
			<h2>Edit {props.type}</h2>
			{inner}
		</div>);
	} else {
		return  (
			<div className={`widget ${props.className ?? 'panel'}`}>
				<a className="btn" onClick={() => setVisible(true)}>e</a>
				{props.children}
			</div>);
	}
}
