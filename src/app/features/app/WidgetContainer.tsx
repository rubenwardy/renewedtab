import React, { useState, KeyboardEvent } from "react";
import { getSchemaForWidget, WidgetProps, getThemeSchemaForWidget } from "../../Widget";
import Modal from "app/components/Modal";
import { Form } from "app/components/forms";
import ErrorView, { ErrorBoundary } from "app/components/ErrorView";
import { usePromise } from "app/hooks";
import { FormattedMessage, useIntl } from "react-intl";
import { miscMessages } from "app/locale/common";
import Button, { ButtonVariant } from "app/components/Button";
import { SchemaEntry } from "app/utils/Schema";
import { MyFormattedMessage } from "app/locale/MyMessageDescriptor";


interface WidgetDialogProps<T> extends WidgetProps<T> {
	onClose: () => void;
}


function WidgetEditor<T>(props: WidgetDialogProps<T>) {
	const intl = useIntl();
	const themeSchema = getThemeSchemaForWidget(props, props.typeDef);
	const [forceKey, setForce] = useState({});
	const forceUpdate = () => setForce({});

	const title = intl.formatMessage(
		{ defaultMessage: "Edit {type}" },
		{ type: intl.formatMessage(props.typeDef.title) });

	const [schema, error] = usePromise(() => getSchemaForWidget(props, props.typeDef, intl),
			[props.type, props.id, forceKey]);
	if (!schema) {
		return (
			<Modal title={title} {...props}>
				<div className="modal-body">
					<ErrorView error={error} loading={true} />
				</div>
			</Modal>);
	}

	function onChange() {
		if (typeof props.typeDef.schema == "function") {
			forceUpdate();
		}

		props.save();
	}

	const isWide = Object.values(schema as Record<string, SchemaEntry>)
		.some(field => field.type == "array" || field.type == "unordered_array");

	const EditHeaderComponent = props.typeDef.editHeaderComponent;

	return (
		<Modal title={title} wide={isWide} {...props}>
			<div className="modal-body">
				{props.typeDef.editHint &&
					<p className="text-muted">
						<MyFormattedMessage message={props.typeDef.editHint} />
					</p>}

				{EditHeaderComponent && (
					<EditHeaderComponent {...props} onChange={onChange} />)}

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
			<div className="modal-footer buttons">
				<Button onClick={props.onClose} label={miscMessages.ok}
					data-cy="edit-ok" />
			</div>
		</Modal>);
}


function WidgetDelete<T>(props: WidgetDialogProps<T>) {
	const intl = useIntl();
	const title = intl.formatMessage(
			{ defaultMessage: "Remove {type}" },
			{ type: intl.formatMessage(props.typeDef.title) });
	return (
		<Modal title={title} {...props}>
			<div className="modal-body">
				<FormattedMessage
					defaultMessage="Are you sure you want to permanently remove this widget?"
					description="Delete widget modal message" />
			</div>
			<div className="modal-footer buttons">
				<Button variant={ButtonVariant.Secondary} data-cy="cancel"
					onClick={props.onClose} label={miscMessages.cancel} />
				<Button variant={ButtonVariant.Danger} autoFocus={true}
					onClick={props.remove} label={miscMessages.delete}
					data-cy="delete" />
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
	const intl = useIntl();

	switch (mode) {
	case WidgetMode.Edit:
		return (<WidgetEditor onClose={close} {...props} />);
	case WidgetMode.Delete:
		return (<WidgetDelete onClose={close} {...props} />);
	}

	if (typeof browser === "undefined" && props.typeDef.isBrowserOnly === true) {
		return (
			<>
				<div className="widget-bar">
					<i className="widget-handle fas fa-grip-vertical" />
					<span className="widget-title widget-handle">
						<i className="fas fa-grip-vertical mr-3" />
						<FormattedMessage {...props.typeDef.title} />
					</span>
					<a className="btn" onClick={() => setMode(WidgetMode.Delete)}>
						<i className="fas fa-trash" />
					</a>
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

	const widgetTitle = intl.formatMessage(props.typeDef.title);
	const widgetTitleLabel = intl.formatMessage(miscMessages.typeWidget, { name:  widgetTitle });
	const Child = props.typeDef.Component;
	return (
		<div className="widget-inner" onKeyPress={onKeyPress} tabIndex={0}
				role="region" aria-label={widgetTitleLabel}>
			<div className="widget-bar">
				<i className="widget-handle fas fa-grip-vertical" />
				<div className="widget-title widget-handle">
					{widgetTitle}
				</div>

				<Button variant={ButtonVariant.None}
					className="widget-delete"
					onClick={() => setMode(WidgetMode.Delete)}
					icon="fa fa-trash"
					title={miscMessages.delete} />

				<Button variant={ButtonVariant.None}
					onClick={props.duplicate}
					data-cy="widget-duplicate"
					icon="fas fa-clone"
					title={miscMessages.duplicate} />

				<Button variant={ButtonVariant.None}
					className="btn widget-edit"
					onClick={() => setMode(WidgetMode.Edit)}
					icon="fas fa-pen"
					title={miscMessages.edit} />
			</div>
			<ErrorBoundary>
				<Child {...props} />
			</ErrorBoundary>
		</div>);
}
