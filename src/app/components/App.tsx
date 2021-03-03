import React, { useState } from "react";
import { Widget } from "./Widget";
import { WidgetManager } from "app/WidgetManager";
import { Clock, Search } from "app/widgets";
import CreateWidgetDialog from "./CreateWidgetDialog";

const widgetManager = new WidgetManager();

function App(_props: any) {
	const [createVisible, setCreateVisible] = useState(false);

	const widgets = widgetManager.widgets;
	return (
		<div>
			<CreateWidgetDialog visible={createVisible} manager={widgetManager} onClose={() => setCreateVisible(false)} />
			<main className={widgets.length > 5 ? "main-wide" : ""}>
				<Clock showSeconds={false} />
				<Widget type="Search" id={0} save={() => {}}
					child={Search} props={{searchTitle: "DuckDuckGo", searchURL: "https://duckduckgo.com"}} />
				<div className="grid">
					{widgets}
					<a className="btn" onClick={() => setCreateVisible(true)}>+</a>
				</div>
			</main>
		</div>);
}

export default App;
