import React from "react";
import { WidgetManager } from "../WidgetManager";
import { WidgetTypes } from "../widgets";
import Modal from "./Modal";

interface CreateWidgetDialog {
	isOpen: boolean;
	onClose: () => void;
	manager: WidgetManager;
}

export default function CreateWidgetDialog(props: CreateWidgetDialog) {
	function select(key: string) {
		props.manager.createWidget(key);
		props.onClose();
	}

	const widgets = Object.entries(WidgetTypes).sort().map(([key]) =>(
		<li key={key}><a onClick={() => select(key)}>{key}</a></li>))

	return (
		<Modal title="Create Widget" {...props}>
			<ul className="large">
				{widgets}
			</ul>
		</Modal>);
}
