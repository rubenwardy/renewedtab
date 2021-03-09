import React, { useState } from "react";
import { WidgetManager } from "app/WidgetManager";
import CreateWidgetDialog from "./CreateWidgetDialog";
import WidgetContainer from "./WidgetContainer";
import SettingsDialog from "./SettingsDialog";
import BackgroundStore from "app/BackgroundStore";
import Background from "./Background";

const widgetManager = new WidgetManager();
const background = new BackgroundStore();

export default function App(_props: any) {
	const [createIsOpen, setCreateOpen] = useState(false);
	const [settingsIsOpen, setSettingsOpen] = useState(false);
	return (
		<>
			<Background mode={background.getMode()} values={background.getValues()} />
			<CreateWidgetDialog isOpen={createIsOpen} manager={widgetManager} onClose={() => setCreateOpen(false)} />
			<SettingsDialog isOpen={settingsIsOpen} background={background} onClose={() => setSettingsOpen(false)} />
			<WidgetContainer wm={widgetManager} />

			<footer>
				<a onClick={() => setCreateOpen(true)}>Add Widget</a> |&nbsp;
				<a onClick={() => setSettingsOpen(true)}>Settings</a>
			</footer>
		</>);
}
