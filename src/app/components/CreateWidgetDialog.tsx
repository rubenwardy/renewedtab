import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { WidgetManager } from "../WidgetManager";
import { WidgetTypes } from "../widgets";
import Modal from "./Modal";

interface CreateWidgetDialogProps {
	isOpen: boolean;
	onClose: () => void;
	manager: WidgetManager;
}

export default function CreateWidgetDialog(props: CreateWidgetDialogProps) {
	function select(key: string) {
		props.manager.createWidget(key);
		props.onClose();
	}

	const isBrowser = typeof browser !== "undefined";

	const widgetTypes = Object.entries(WidgetTypes).sort();
	const intl = useIntl();

	let widgets = widgetTypes
		.filter(([, widget]) => isBrowser || widget.isBrowserOnly !== true)
		.map(([key, widget]) => (
			<li key={key}>
				<a onClick={() => select(key)}>
					<FormattedMessage {...widget.title} />
					<span className="text-muted ml-1">
						&nbsp;
						<FormattedMessage {...widget.description} />
					</span>
				</a>
			</li>));

	if (!isBrowser) {
		widgets = widgets.concat(widgetTypes
			.filter(([, widget]) => widget.isBrowserOnly === true)
			.map(([key,]) => (
				<li key={key} className="text text-muted">
					{key}
					<span className="ml-1">
						&nbsp;
						<FormattedMessage
								defaultMessage="Requires browser extension version" />
					</span>
				</li>)));
	}

	return (
		<Modal title={intl.formatMessage({ defaultMessage: "Create Widget" })}
				{...props}>
			<ul className="links large">
				{widgets}
			</ul>
		</Modal>);
}
