import { compareString } from "common/utils/string";
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

	const intl = useIntl();
	const widgetTypes = Object.entries(WidgetTypes)
			.map(([key, widget]) => ({
				key,
				title: intl.formatMessage(widget.title),
				description: intl.formatMessage(widget.description),
				isBrowserOnly: widget.isBrowserOnly,
			})).sort((a, b) => compareString(a.title, b.title));

	let widgets = widgetTypes
		.filter((widget) => isBrowser || widget.isBrowserOnly !== true)
		.map((widget) => (
			<li key={widget.key}>
				<a onClick={() => select(widget.key)}>
					{widget.title}
					<span className="text-muted ml-1">
						&nbsp;
						{widget.description}
					</span>
				</a>
			</li>));

	if (!isBrowser) {
		widgets = widgets.concat(widgetTypes
			.filter((widget) => widget.isBrowserOnly === true)
			.map((widget) => (
				<li key={widget.key} className="text text-muted">
					{widget.key}
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
