import { Field } from "Field";
import React, { ChangeEvent, ChangeEventHandler, useState } from "react";

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
