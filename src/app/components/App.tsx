import React, { useState } from "react";
import { WidgetManager } from "app/WidgetManager";
import CreateWidgetDialog from "./CreateWidgetDialog";
import WidgetContainer from "./WidgetContainer";

const widgetManager = new WidgetManager();

export default function App(_props: any) {
	const [createIsOpen, setCreateOpen] = useState(false);
	return (
		<div>
			<CreateWidgetDialog isOpen={createIsOpen} manager={widgetManager} onClose={() => setCreateOpen(false)} />
			<WidgetContainer wm={widgetManager} />

			<footer>
				Created by <a href="https://rubenwardy.com">rubenwardy</a> |&nbsp;
				<a href="https://gitlab.com/rubenwardy/homescreen">Source code</a> |&nbsp;
				<a onClick={() => setCreateOpen(true)}>Add Widget</a>
			</footer>
		</div>);
}
