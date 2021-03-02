import { makeFieldForValue } from "./Field";
import React, { useState } from "react";
import { WidgetProps } from "WidgetManager";

export function Widget<T>(props: WidgetProps<T>) {
	const [visible, setVisible] = useState(false);
	const child = props.child(props.props);

	if (visible) {
		const inner = Object.entries(props.props).map(([key, value]) => {
				const Field = makeFieldForValue(value);
				return (
					<Field key={key} name={key} value={value}
						onChange={(val: any) => {
							(props.props as any)[key] = val;
							props.save();
						}} />);
		});

		return (<div className="widget panel panel-editing"  key={props.id}>
			<a className="btn" onClick={() => setVisible(false)}>x</a>
			<h2>Edit {props.type}</h2>
			{inner}
		</div>);
	} else {
		return  (
			<div className={`widget`} key={props.id}>
				<a className="btn" onClick={() => setVisible(true)}>e</a>
				{child}
			</div>);
	}
}
