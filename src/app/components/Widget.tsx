import { makeFieldForValue } from "./Field";
import React, { useState } from "react";
import { WidgetProps } from "../WidgetManager";

interface WidgetDialogProps<T> extends WidgetProps<T> {
	onClose: () => void;
}

function WidgetEditor<T>(props: WidgetDialogProps<T>) {
	const inner = Object.entries(props.props).map(([key, value]) => {
		const Field = makeFieldForValue(value);
		return (
			<Field key={key} name={key} value={value}
				onChange={(val: any) => {
					(props.props as any)[key] = val;
					props.save();
				}} />);
	});

	return (
		<div className="widget panel panel-editing">
			<span className="widget-btns">
				<a className="btn" onClick={props.onClose}>x</a>
			</span>
			<h2>Edit {props.type}</h2>
			{inner}
		</div>);
}


function WidgetDelete<T>(props: WidgetDialogProps<T>) {
	return (
		<div className="widget panel panel-editing">
			<span className="widget-btns">
				<a className="btn" onClick={props.onClose}>x</a>
			</span>
			<h2>Remove {props.type}?</h2>

			<a className="btn btn-danger" onClick={props.remove}>Delete</a>
			<a className="btn btn-secondary" onClick={props.onClose}>Cancel</a>
		</div>);
}


enum WidgetMode {
	View,
	Edit,
	Delete
}

export function Widget<T>(props: WidgetProps<T>) {
	const [mode, setMode] = useState(WidgetMode.View);
	switch (mode) {
	case WidgetMode.Edit:
		return (<WidgetEditor onClose={() => setMode(WidgetMode.View)} {...props} />);
	case WidgetMode.Delete:
		return (<WidgetDelete onClose={() => setMode(WidgetMode.View)} {...props} />);
	default:
		const child = React.createElement(props.child, props.props);
		return  (
			<div className={`widget`}>
				<span className="widget-btns">
					<a className="btn" onClick={() => setMode(WidgetMode.Edit)}>e</a>
					<a className="btn" onClick={() => setMode(WidgetMode.Delete)}>d</a>
				</span>
				{child}
			</div>);
	}
}
