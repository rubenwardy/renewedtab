import React, { Fragment, useState } from "react";
import { WidgetProps } from "../WidgetManager";
import Modal from "./Modal";
import FieldList from "./FieldList";

interface WidgetDialogProps<T> extends WidgetProps<T> {
	onClose: () => void;
}


function WidgetEditor<T>(props: WidgetDialogProps<T>) {
	return (
		<Modal title={`Edit ${props.type}`} isOpen={true} {...props}>
			<div className="modal-body">
				<FieldList
						values={props.props}
						schema={props.child.schema}
						onChange={props.save} />
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

	switch (mode) {
	case WidgetMode.Edit:
		return (<WidgetEditor onClose={close} {...props} />);
	case WidgetMode.Delete:
		return (<WidgetDelete onClose={close} {...props} />);
	default:
		const Child = React.createElement(props.child, props.props);
		return (
			<>
				<div className="widget-strip">
					<i className="collapsed fas fa-ellipsis-h" />
					<span className="widget-title">{props.type}</span>
					<span className="widget-btns">
						<a className="btn" onClick={() => setMode(WidgetMode.Edit)}>
							<i className="fas fa-pen" />
						</a>
						<a className="btn" onClick={() => setMode(WidgetMode.Delete)}>
							<i className="fas fa-trash" />
						</a>
					</span>
				</div>
				{Child}
			</>);
	}
}
