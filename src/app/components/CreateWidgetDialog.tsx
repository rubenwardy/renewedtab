import React from "react";
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

	let widgets = widgetTypes
		.filter(([_, widget]) => isBrowser || widget.isBrowserOnly !== true)
		.map(([key, widget]) => (
			<li key={key}>
				<a onClick={() => select(key)}>
					{key}
					<span className="text-muted ml-1">
						&nbsp;
						{widget.description}
					</span>
				</a>
			</li>));

	if (!isBrowser) {
		widgets = widgets.concat(widgetTypes
			.filter(([_, widget]) => widget.isBrowserOnly === true)
			.map(([key, widget]) => (
				<li key={key} className="text text-muted">
					{key}
					<span className="ml-1">
						&nbsp;
						Requires browser extension version
					</span>
				</li>)));
	}

	return (
		<Modal title="Create Widget" {...props}>
			<ul className="large">
				{widgets}
			</ul>
		</Modal>);
}
