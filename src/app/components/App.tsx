import React, { useState } from "react";
import { Widget } from "./Widget";
import { WidgetManager } from "app/WidgetManager";
import { Clock, Search, WidgetTypes } from "app/widgets";
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

	const widgets = widgetManager.widgets.map(raw => (
		<ErrorBoundary key={raw.id}>
			<Widget id={raw.id}
				type={raw.type} props={raw.props}
				child={WidgetTypes[raw.type]}
				position={raw.position} size={raw.size}
				save={widgetManager.save.bind(widgetManager)}
				remove={() => handleRemove(raw.id)} />
		</ErrorBoundary>));

	return (
		<main>
			<div className="grid">
				{widgets}
			</div>
		</main>);
}

function App(_props: any) {
	const [createIsOpen, setCreateOpen] = useState(false);
	return (
		<div>
			<CreateWidgetDialog isOpen={createIsOpen} manager={widgetManager} onClose={() => setCreateOpen(false)} />
			<WidgetContainer />
			<a className="btn" onClick={() => setCreateOpen(true)}>Add Widget</a>
		</div>);
}

export default App;
