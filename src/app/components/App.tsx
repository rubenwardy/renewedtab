import React, { useState } from "react";
import { Widget } from "./Widget";
import { WidgetManager } from "app/WidgetManager";
import { Clock, Search, WidgetTypes } from "app/widgets";
import CreateWidgetDialog from "./CreateWidgetDialog";
import { ErrorBoundary } from "./ErrorBoundary";

const widgetManager = new WidgetManager();

function WidgetContainer(_props: any) {
	const [_, setUpdate] = useState({});

	function handleRemove(id: number) {
		widgetManager.removeWidget(id);
		setUpdate({});
	}

	const widgets = widgetManager.widgets.map(raw => (
		<ErrorBoundary key={raw.id}>
			<Widget id={raw.id}
				type={raw.type} props={raw.props}
				child={WidgetTypes[raw.type]}
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
