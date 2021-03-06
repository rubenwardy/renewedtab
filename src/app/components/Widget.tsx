import { makeFieldForValue } from "./Field";
import React, { CSSProperties, useState } from "react";
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
		<div className="panel panel-editing">
			<h2>Edit {props.type}</h2>
			{inner}
		</div>);
}


function WidgetDelete<T>(props: WidgetDialogProps<T>) {
	return (
		<div className="panel panel-editing">
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

	const close = () => setMode(WidgetMode.View);
	let content: JSX.Element;
	let strip = (
		<span className="widget-btns">
			<a className="btn" onClick={close}>x</a>
		</span>)

	switch (mode) {
	case WidgetMode.Edit:
		content = (<WidgetEditor onClose={close} {...props} />);
		break;
	case WidgetMode.Delete:
		content = (<WidgetDelete onClose={close} {...props} />);
		break;
	default:
		content = React.createElement(props.child, props.props);
		strip = (
			<div className="widget-strip">
				<span className="widget-title">{props.type}</span>
				<span className="widget-btns">
					<a className="btn" onClick={() => setMode(WidgetMode.Edit)}>e</a>
					<a className="btn" onClick={() => setMode(WidgetMode.Delete)}>d</a>
				</span>
			</div>);
		break;
	}


	const style: CSSProperties = {};
	style.gridColumn = `span ${props.child.defaultSize.x}`;
	style.gridRow = `span ${props.child.defaultSize.y}`;

	// const h = props.child.defaultSize.y;
	// style.maxHeight = `calc(${h-1}*1em + ${h}*50px)`;

	return (<div className={`widget`} style={style}>{strip}{content}</div>);
}
