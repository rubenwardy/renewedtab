import React from "react";
import { WidgetManager } from "WidgetManager";
import { WidgetTypes } from "widgets";

interface CreateWidgetDialog {
	visible: boolean;
	manager: WidgetManager;
	onClose: () => void;
}

export default function CreateWidgetDialog(props: CreateWidgetDialog) {
	if (!props.visible) {
		return null;
	}

	function select(key: string) {
		props.manager.createWidget(key);
		props.onClose();
	}

	const widgets = Object.entries(WidgetTypes).sort().map(([key, value]) =>(
		<li key={key}><a onClick={() => select(key)}>{key}</a></li>))

	return (
		<aside className="modal" onClick={props.onClose}>
			<div className="panel flush modal-body" onClick={(e) => e.stopPropagation()}>
				<h2 className="panel-inset">Create Widget</h2>
				<ul>
					{widgets}
				</ul>
			</div>
		</aside>
	);
}
