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

			<footer className="text-shadow-soft">
				<a onClick={() => setCreateOpen(true)}>
					<i className="fas fa-plus mr-1" />
					Add Widget
				</a>
				<span className="mx-2">|</span>
				<a onClick={() => setSettingsOpen(true)}>
					<i className="large fas fa-cog mr-1" />
				</a>
			</footer>
		</>);
}
