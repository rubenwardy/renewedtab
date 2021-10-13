import { miscMessages } from "app/locale/common";
import { queryMatchesAny } from "app/utils";
import React, { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { WidgetManager } from "../WidgetManager";
import { WidgetTypes } from "../widgets";
import Modal from "./Modal";

interface CreateWidgetDialogProps {
	onClose: () => void;
	manager: WidgetManager;
}

export default function CreateWidgetDialog(props: CreateWidgetDialogProps) {
	const intl = useIntl();
	const [query, setQuery] = useState("");

	function select(key: string) {
		props.manager.createWidget(key);
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
					{widget.title}
					<span className="ml-1">
						&nbsp;
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
			<ul className="links large">
				{widgets}
				{widgets.length == 0 && (
					<li className="section">
						<FormattedMessage {...miscMessages.noResults} />
					</li>)}
			</ul>
		</Modal>);
}
