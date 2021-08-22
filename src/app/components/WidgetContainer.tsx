import React, { useState, KeyboardEvent } from "react";
import { getSchemaForWidget, WidgetProps, getThemeSchemaForWidget } from "../Widget";
import Modal from "./Modal";
import { Form } from "./forms";
import ErrorView, { ErrorBoundary } from "./ErrorView";
import { usePromise } from "app/hooks";
import { FormattedMessage, useIntl } from "react-intl";
import { miscMessages } from "app/locale/common";
import Button, { ButtonVariant } from "./Button";


interface WidgetDialogProps<T> extends WidgetProps<T> {
	onClose: () => void;
}


function WidgetEditor<T>(props: WidgetDialogProps<T>) {
	const intl = useIntl();
	const themeSchema = getThemeSchemaForWidget(props, props.child);
	const [forceKey, setForce] = useState({});
	const forceUpdate = () => setForce({});

	const [schema, error] = usePromise(() => getSchemaForWidget(props, props.child, intl),
			[props.type, props.id, forceKey]);
	if (!schema) {
		return (<ErrorView error={error} loading={true} />);
	}

	function onChange() {
		if (typeof props.child.schema == "function") {
			forceUpdate();
		}

		props.save();
	}

	const title = intl.formatMessage(
			{ defaultMessage: "Edit {type}" },
			{ type: intl.formatMessage(props.child.title) });

	const isWide = Object.values(schema).some(field => field.type == "array" || field.type == "unordered_array");

	return (
		<Modal title={title} wide={isWide} isOpen={true} {...props}>
			<div className="modal-body">
				{props.child.editHint &&
					<p className="text-muted">
						<FormattedMessage {...props.child.editHint} />
					</p>}

				<Form
						values={props.props}
						schema={schema}
						onChange={onChange} />

				<h2 className="mt-6">
					<FormattedMessage
						defaultMessage="Styling"
						description="Subheading for per-widget styling properties" />
				</h2>

				<Form
						values={props.theme}
						schema={themeSchema}
						onChange={onChange} />
			</div>
			<div className="modal-footer">
				<Button onClick={props.onClose} label={miscMessages.ok} />
			</div>
		</Modal>);
}


function WidgetDelete<T>(props: WidgetDialogProps<T>) {
	const intl = useIntl();
	const title = intl.formatMessage(
			{ defaultMessage: "Remove {type}" },
			{ type: props.type });
	return (
		<Modal title={title} isOpen={true} {...props}>
			<div className="modal-body">
				<FormattedMessage
					defaultMessage="This will permanently delete this widget."
					description="Delete widget modal message" />
			</div>
			<div className="modal-footer button-set">
				<Button variant={ButtonVariant.Secondary}
					onClick={props.onClose} label={miscMessages.cancel} />
				<Button variant={ButtonVariant.Danger} autoFocus={true}
					onClick={props.remove} label={miscMessages.delete} />
			</div>
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
					<span className="widget-title">
						<i className="fas fa-grip-vertical mr-3" />
						<FormattedMessage {...props.child.title} />
					</span>
					<span className="widget-btns">
						<a className="btn" onClick={() => setMode(WidgetMode.Delete)}>
							<i className="fas fa-trash" />
						</a>
					</span>
				</div>
				<div className="panel text-muted">
					<FormattedMessage
							defaultMessage="This widget requires the browser extension version." />
				</div>
			</>);
	}

	function onKeyPress(e: KeyboardEvent<HTMLInputElement>) {
		const currentElement = document.activeElement;
		if (currentElement?.nodeName == "INPUT" || currentElement?.nodeName == "TEXTAREA") {
			return;
		}

		if (e.key == "e") {
			setMode(WidgetMode.Edit);
		} else if (e.key == "Delete" || e.key == "d") {
			setMode(WidgetMode.Delete);
		}
	}

	const Child = props.child;
	return (
		<div className="widget-inner" onKeyPress={onKeyPress}>
			<div className="widget-strip">
				<span className="widget-title">
					<i className="fas fa-grip-vertical mr-3" />
					<FormattedMessage {...props.child.title} />
				</span>
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
		</div>);
}
