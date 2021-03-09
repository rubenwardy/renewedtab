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

	const widgets = Object.entries(WidgetTypes).sort().map(([key, widget]) => (
		<li key={key}>
			<a onClick={() => select(key)}>
				{key}
				<span className="text-muted ml-1">
					&nbsp;
					{widget.description}
				</span>
			</a>
		</li>))

	return (
		<Modal title="Create Widget" {...props}>
			<ul className="large">
				{widgets}
			</ul>
		</Modal>);
}
