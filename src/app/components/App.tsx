import React, { useState } from "react";
import { WidgetManager } from "app/WidgetManager";
import CreateWidgetDialog from "./CreateWidgetDialog";
import WidgetContainer from "./WidgetContainer";
import SettingsDialog from "./SettingsDialog";
import Background from "./Background";
import { useBackground, usePromise } from "app/hooks";

const widgetManager = new WidgetManager();

export default function App(_props: any) {
	usePromise(() => widgetManager.load(), []);
	const [background, setBackground] = useBackground([]);
	const [createIsOpen, setCreateOpen] = useState(false);
	const [settingsIsOpen, setSettingsOpen] = useState(false);

	return (
		<>
			<Background background={background} />
			<CreateWidgetDialog isOpen={createIsOpen}
					manager={widgetManager}
					onClose={() => setCreateOpen(false)} />
			<SettingsDialog isOpen={settingsIsOpen}
					onClose={() => setSettingsOpen(false)}
					background={background} setBackground={setBackground} />
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
