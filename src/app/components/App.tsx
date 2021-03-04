import React, { useState } from "react";
import { Widget } from "./Widget";
import { WidgetManager } from "app/WidgetManager";
import { Clock, Search, WidgetTypes } from "app/widgets";
import CreateWidgetDialog from "./CreateWidgetDialog";

const widgetManager = new WidgetManager();

function WidgetContainer(_props: any) {
	const [_, setUpdate] = useState({});

	function handleRemove(id: number) {
		widgetManager.removeWidget(id);
		setUpdate({});
	}

	const widgets = widgetManager.widgets.map(raw => (
		<Widget key={raw.id} id={raw.id}
			type={raw.type} props={raw.props}
			child={WidgetTypes[raw.type]}
			save={widgetManager.save.bind(widgetManager)}
			remove={() => handleRemove(raw.id)} />));

	return (
		<main className={widgets.length > 5 ? "main-wide" : ""}>
			<Clock showSeconds={false} />
			<Widget type="Search" id={0} save={() => {}} remove={() => {}}
				child={Search} props={{searchTitle: "DuckDuckGo", searchURL: "https://duckduckgo.com"}} />
			<div className="grid">
				{widgets}
			</div>
		</main>);
}

function App(_props: any) {
	const [createVisible, setCreateVisible] = useState(false);
	return (
		<div>
			<CreateWidgetDialog visible={createVisible} manager={widgetManager} onClose={() => setCreateVisible(false)} />
			<WidgetContainer />
			<a className="btn" onClick={() => setCreateVisible(true)}>Add Widget</a>
		</div>);
}

export default App;
