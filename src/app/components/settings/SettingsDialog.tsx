import React, { useState } from "react";
import AboutSettings from "./AboutSettings";
import BackgroundSettings, { BackgroundSettingsProps } from "./BackgroundSettings";
import Modal from "../Modal";
import ImportExport from "./ImportExport";

interface SettingsDialogProps extends BackgroundSettingsProps {
	isOpen: boolean;
	onClose: () => void;
}

enum SettingsTab {
	Background,
	ImportExport,
	About,
}

declare type SettingsTabType = keyof typeof SettingsTab;

function getTitleForTab(tab: SettingsTab) {
	switch (tab) {
	case SettingsTab.Background:
		return "Background";
	case SettingsTab.ImportExport:
		return "Import / Export";
	case SettingsTab.About:
		return "About and Credits";
	}
}

function getComponentForTab(tab: SettingsTab) {
	switch (tab) {
	case SettingsTab.Background:
		return BackgroundSettings;
	case SettingsTab.ImportExport:
		return ImportExport;
	case SettingsTab.About:
		return AboutSettings;
	}
}

export default function SettingsDialog(props: SettingsDialogProps) {
	const [currentTab, setTab] = useState(SettingsTab.Background);

	const tabs = Object.keys(SettingsTab)
		.filter(value => isNaN(Number(value)))
		.map(tabName => {
			const tab = SettingsTab[tabName as SettingsTabType];
			const isSelected = tab == currentTab;
			return (
				<a key={tabName} onClick={() => setTab(tab)}
						className={isSelected ? "active" : undefined}>
					{getTitleForTab(tab)}
				</a>)
		});

	const Tab = getComponentForTab(currentTab);

	return (
		<Modal title="Settings" {...props}>
			<div className="modal-flex">
				<nav>
					{tabs}
				</nav>
				<Tab {...props} />
			</div>
		</Modal>);
}
