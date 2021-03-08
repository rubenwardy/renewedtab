import React, { useState } from "react";
import { WidgetManager } from "app/WidgetManager";
import CreateWidgetDialog from "./CreateWidgetDialog";
import WidgetContainer from "./WidgetContainer";
import SettingsDialog from "./SettingsDialog";
import Background from "app/Background";

const widgetManager = new WidgetManager();
const background = new Background();

export default function App(_props: any) {
	background.update();
	const [createIsOpen, setCreateOpen] = useState(false);
	const [settingsIsOpen, setSettingsOpen] = useState(false);
	return (
		<>
			<CreateWidgetDialog isOpen={createIsOpen} manager={widgetManager} onClose={() => setCreateOpen(false)} />
			<SettingsDialog isOpen={settingsIsOpen} background={background} onClose={() => setSettingsOpen(false)} />
			<WidgetContainer wm={widgetManager} />

			<footer>
				<a onClick={() => setCreateOpen(true)}>Add Widget</a> |&nbsp;
				<a onClick={() => setSettingsOpen(true)}>Settings</a>
			</footer>
		</>);
}
