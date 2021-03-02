import React from "react";
import { Widget } from "Widget";
import { WidgetManager } from "WidgetManager";
import { Clock, Search } from "widgets";

const widgetManager = new WidgetManager();

function App(_props: any) {
	widgetManager.save();
	return (
		<main>
			<Clock showSeconds={false} />
			<Widget type="Search" id={0} save={() => {}}
				child={Search} props={{searchTitle: "DuckDuckGo", searchURL: "https://duckduckgo.com"}} />
			<div className="grid">
				{widgetManager.widgets}
			</div>
		</main>);
}

export default App;
