import React, { useState } from "react";
import { getSchemaForWidget, WidgetProps, getThemeSchemaForWidget } from "../Widget";
import Modal from "./Modal";
import { Form } from "./forms";
import { ErrorBoundary } from "./ErrorBoundary";
import { useForceUpdate } from "app/hooks";
import { FormattedMessage, useIntl } from "react-intl";
import { miscMessages } from "app/locale/common";
import Button, { ButtonVariant } from "./Button";


interface WidgetDialogProps<T> extends WidgetProps<T> {
	onClose: () => void;
}


function WidgetEditor<T>(props: WidgetDialogProps<T>) {
	const schema = getSchemaForWidget(props, props.child);
	const themeSchema = getThemeSchemaForWidget(props, props.child);
	const forceUpdate = useForceUpdate();
	const intl = useIntl();

	function onChange() {
		if (typeof props.child.schema == "function") {
			forceUpdate();
		}

		props.save();
	}

	const title = intl.formatMessage(
			{ defaultMessage: "Edit {type}" },
			{ type: intl.formatMessage(props.child.title) });

	return (
		<Modal title={title} isOpen={true} {...props}>
			<div className="modal-body">
				{props.child.editHint &&
					<p className="text-muted">
						<FormattedMessage {...props.child.editHint} />
					</p>}

				<Form
						values={props.props}
						schema={schema}
						onChange={onChange} />

				<h2 className="mt-4">
					<FormattedMessage
						defaultMessage="Styling"
						description="Subheading for per-widget styling properties" />
				</h2>

				<Form
						values={props.theme}
						schema={themeSchema}
						onChange={onChange} />

				<Button variant={ButtonVariant.Secondary} onClick={props.onClose} label={miscMessages.ok} />
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
			<p className="modal-body">
				<Button variant={ButtonVariant.Danger} onClick={props.remove} label={miscMessages.delete} />
				<Button variant={ButtonVariant.Secondary} onClick={props.onClose} label={miscMessages.cancel} />
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

	const Child = props.child;
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
