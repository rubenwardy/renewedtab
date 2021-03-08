import { makeField } from "./Field";
import React, { Fragment, useState } from "react";
import { WidgetProps } from "../WidgetManager";
import Modal from "./Modal";

interface WidgetDialogProps<T> extends WidgetProps<T> {
	onClose: () => void;
}


function WidgetEditor<T>(props: WidgetDialogProps<T>) {
	const inner = Object.entries(props.child.schema).map(([key, type]) => {
		const value = (props.props as any)[key];
		const Field = makeField(type);
		return (
			<Field key={key} name={key} value={value}
				onChange={(val: any) => {
					(props.props as any)[key] = val;
					props.save();
				}} />);
	});

	return (
		<Modal title={`Edit ${props.type}`} isOpen={true} {...props}>
			<div className="modal-body">
				{inner}
				<a className="btn btn-secondary" onClick={props.onClose}>OK</a>
			</div>
		</Modal>);
}


function WidgetDelete<T>(props: WidgetDialogProps<T>) {
	return (
		<Modal title={`Remove ${props.type}`} isOpen={true} {...props}>
			<p className="modal-body">
				<a className="btn btn-danger" onClick={props.remove}>Delete</a>
				<a className="btn btn-secondary" onClick={props.onClose}>Cancel</a>
			</p>
		</Modal>);
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

	return (<Fragment>{strip}{content}</Fragment>);
}
