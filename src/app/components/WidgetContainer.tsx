import React, { Fragment, useState } from "react";
import { getSchemaForWidget, WidgetProps } from "../Widget";
import Modal from "./Modal";
import { Form } from "./forms";
import { ErrorBoundary } from "./ErrorBoundary";
import { useForceUpdate } from "app/hooks";

interface WidgetDialogProps<T> extends WidgetProps<T> {
	onClose: () => void;
}


function WidgetEditor<T>(props: WidgetDialogProps<T>) {
	const schema = getSchemaForWidget(props, props.child);
	const forceUpdate = useForceUpdate();

	function onChange() {
		if (typeof props.child.schema == "function") {
			forceUpdate();
		}

		props.save();
	}

	return (
		<Modal title={`Edit ${props.type}`} isOpen={true} {...props}>
			<div className="modal-body">
				{props.child.editHint &&
					<p className="text-muted">{props.child.editHint}</p>}
				<Form
						showEmptyView={!props.child.editHint}
						values={props.props}
						schema={schema}
						onChange={onChange} />
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


export function WidgetContainer<T>(props: WidgetProps<T>) {
	const [mode, setMode] = useState(WidgetMode.View);
	const close = () => setMode(WidgetMode.View);

	switch (mode) {
	case WidgetMode.Edit:
		return (<WidgetEditor onClose={close} {...props} />);
	case WidgetMode.Delete:
		return (<WidgetDelete onClose={close} {...props} />);
	}

	if (typeof browser === "undefined" && props.child.isBrowserOnly === true) {
		return (
			<>
				<div className="widget-strip">
					<i className="collapsed fas fa-ellipsis-h" />
					<span className="widget-title">{props.type}</span>
					<span className="widget-btns">
						<a className="btn" onClick={() => setMode(WidgetMode.Delete)}>
							<i className="fas fa-trash" />
						</a>
					</span>
				</div>
				<div className="panel text-muted">
					This widget requires the browser extension version.
				</div>
			</>);
	}

	const Child = props.child;
	return (
		<>
			<div className="widget-strip">
				<i className="collapsed fas fa-ellipsis-h" />
				<span className="widget-title">{props.type}</span>
				<span className="widget-btns">
					<a className="btn" onClick={() => setMode(WidgetMode.Delete)}>
						<i className="fas fa-trash" />
					</a>
					<a className="btn" onClick={() => setMode(WidgetMode.Edit)}>
						<i className="fas fa-pen" />
					</a>
				</span>
			</div>
			<ErrorBoundary>
				<Child {...props} />
			</ErrorBoundary>
		</>);
}
