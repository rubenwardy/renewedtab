import React, { useState } from "react";
import { Widget } from "./Widget";
import { WidgetManager, WidgetProps } from "app/WidgetManager";
import { WidgetTypes } from "app/widgets";
import CreateWidgetDialog from "./CreateWidgetDialog";
import { ErrorBoundary } from "./ErrorBoundary";
import WidgetLayouter from "app/WidgetLayouter";
import { Vector2 } from "app/utils/Vector2";

const widgetManager = new WidgetManager();

function WidgetContainer(_props: any) {
	const [_, setUpdate] = useState({});

	function handleRemove(id: number) {
		widgetManager.removeWidget(id);
		setUpdate({});
	}

	const layouter = new WidgetLayouter(new Vector2(15, 12));
	layouter.resolveAll(widgetManager.widgets);

	const widgets = widgetManager.widgets.map(widget => {
		const props : WidgetProps<any> = {
			...widget,
			child: WidgetTypes[widget.type],
			save: widgetManager.save.bind(widgetManager),
			remove: () => handleRemove(widget.id)
		};

		return (
			<ErrorBoundary key={widget.id}>
				<Widget {...props} />
			</ErrorBoundary>)
		});

	return (
		<main>
			<div className="grid">
				{widgets}
			</div>
		</main>);
}

export default function App(_props: any) {
	const [createIsOpen, setCreateOpen] = useState(false);
	return (
		<div>
			<CreateWidgetDialog isOpen={createIsOpen} manager={widgetManager} onClose={() => setCreateOpen(false)} />
			<WidgetContainer />

			<footer>
				Created by <a href="https://rubenwardy.com">rubenwardy</a> |&nbsp;
				<a href="https://gitlab.com/rubenwardy/homescreen">Source code</a> |&nbsp;
				<a onClick={() => setCreateOpen(true)}>Add Widget</a>
			</footer>
		</div>);
}
