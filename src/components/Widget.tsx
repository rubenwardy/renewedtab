import { makeFieldForValue } from "./Field";
import React, { useState } from "react";
import { WidgetProps } from "WidgetManager";

export function Widget<T>(props: WidgetProps<T>) {
	const [visible, setVisible] = useState(false);
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

		return (<div className="widget panel panel-editing">
			<a className="btn" onClick={() => setVisible(false)}>x</a>
			<h2>Edit {props.type}</h2>
			{inner}
		</div>);
	} else {
		const child = React.createElement(props.child, props.props);
		return  (
			<div className={`widget`}>
				<a className="btn" onClick={() => setVisible(true)}>e</a>
				{child}
			</div>);
	}
}
