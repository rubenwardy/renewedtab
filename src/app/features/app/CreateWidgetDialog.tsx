import { miscMessages } from "app/locale/common";
import { queryMatchesAny } from "app/utils";
import React, { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { WidgetTypes } from "../../widgets";
import Modal from "app/components/Modal";
import { useWidgetManager } from "app/hooks/widgetManagerContext";

interface CreateWidgetDialogProps {
	onClose: () => void;
}

export default function CreateWidgetDialog(props: CreateWidgetDialogProps) {
	const intl = useIntl();
	const [query, setQuery] = useState("");
	const widgetManager = useWidgetManager();

	function select(key: string) {
		widgetManager.createWidget(key);
		props.onClose();
	}

	const isBrowser = typeof browser !== "undefined";

	const widgetTypes = Object.entries(WidgetTypes)
			.map(([key, widget]) => ({
				key,
				title: intl.formatMessage(widget.title),
				description: intl.formatMessage(widget.description),
				isBrowserOnly: widget.isBrowserOnly,
			}))
			.filter(widget => queryMatchesAny(query, widget.title, widget.description))
			.sort((a, b) => a.title.localeCompare(b.title, intl.locale, {
					sensitivity: "base" }));

	let widgets = widgetTypes
		.filter((widget) => isBrowser || widget.isBrowserOnly !== true)
		.map((widget) => (
			<li key={widget.key} data-widget-type={widget.key}>
				<button onClick={() => select(widget.key)}>
					{widget.title}
					<span className="text-muted ml-1">
						{" "}
						{widget.description}
					</span>
				</button>
			</li>));

	if (!isBrowser) {
		widgets = widgets.concat(widgetTypes
			.filter((widget) => widget.isBrowserOnly === true)
			.map((widget) => (
				<li key={widget.key} className="text-disabled text-muted">
					{widget.title}
					<span className="ml-1">
						{" "}
						<FormattedMessage {...miscMessages.requiresBrowserVersion} />
					</span>
				</li>)));
	}

	const placeholder = intl.formatMessage({
		defaultMessage: "Search widgets...",
		description: "Create Widgets modal: search widgets placeholder"
	})

	return (
		<Modal title={intl.formatMessage({ defaultMessage: "Create Widget" })} wide={true}  {...props}>
			<input type="search" placeholder={placeholder} autoFocus={true}
				value={query} onChange={(e) => setQuery(e.target.value)} />
			<ul className="links large" role="menu">
				{widgets}
				{widgets.length == 0 && (
					<li className="section" role="menuitem">
						<FormattedMessage {...miscMessages.noResults} />
					</li>)}
			</ul>
		</Modal>);
}
