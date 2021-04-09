import React, { useState } from "react";
import { WidgetManager } from "app/WidgetManager";
import CreateWidgetDialog from "./CreateWidgetDialog";
import WidgetGrid from "./WidgetGrid";
import SettingsDialog from "./settings/SettingsDialog";
import Background from "./backgrounds";
import { useBackground, usePromise, useStorage } from "app/hooks";
import { ErrorBoundary } from "./ErrorBoundary";


const widgetManager = new WidgetManager();

export default function App(_props: any) {
	usePromise(() => widgetManager.load(), []);
	const [background, setBackground] = useBackground();
	const [createIsOpen, setCreateOpen] = useState(false);
	const [settingsIsOpen, setSettingsOpen] = useState(false);
	const [widgetsHidden, setWidgetsHidden] = useState(false);
	const [isLocked, setIsLocked] = useStorage<boolean>("locked", false);

	const classes: string[] = [];
	if (widgetsHidden) {
		classes.push("hidden");
	}

	classes.push(isLocked ? "locked" : "unlocked");

	return (
		<div className={classes.join(" ")}>
			<ErrorBoundary errorChild={() => (<div id="background"></div>)}>
				<Background background={background} setWidgetsHidden={setWidgetsHidden} />
			</ErrorBoundary>
			<CreateWidgetDialog isOpen={createIsOpen}
					manager={widgetManager}
					onClose={() => setCreateOpen(false)} />
			<SettingsDialog isOpen={settingsIsOpen}
					onClose={() => setSettingsOpen(false)}
					background={background} setBackground={setBackground} />
			<WidgetGrid wm={widgetManager} isLocked={isLocked ?? false} />

			<footer className="text-shadow-soft">
				{isLocked && (
					<a onClick={() => setIsLocked(false)} tabIndex={0}>
						<i className={"large fas mr-1 " +
								(isLocked ? "fa-lock" : "fa-lock")} />
					</a>)}

				{!isLocked && (
					<>
						<a onClick={() => setCreateOpen(true)} tabIndex={0}>
							<i className="fas fa-plus mr-1" />
							Add Widget
						</a>
						<a onClick={() => setSettingsOpen(true)} className="ml-3">
							<i className="large fas fa-cog" />
						</a>
						<a onClick={() => setIsLocked(true)} className="ml-3">
							<i className="large fas mr-1 fa-lock-open" />
						</a>
					</>)}
			</footer>
		</div>);
}
