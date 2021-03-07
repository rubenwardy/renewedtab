import { makeFieldForValue } from "./Field";
import React, { CSSProperties, useState } from "react";
import { WidgetProps } from "../WidgetManager";
import { Vector2 } from "app/utils/Vector2";


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
	const position = props.position?.add(new Vector2(1, 1));

	style.gridColumn = `${position?.x ?? "auto"} / span ${props.size.x}`;
	style.gridRow = `${position?.y ?? "auto"} / span ${props.size.y}`;

	// const h = props.child.defaultSize.y;
	// style.maxHeight = `calc(${h-1}*1em + ${h}*50px)`;

	return (<div className={`widget`} style={style}>{strip}{content}</div>);
}
