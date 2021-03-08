import Background from "app/Background";
import React, { useState } from "react";
import AboutSettings from "./AboutSettings";
import BackgroundSettings from "./BackgroundSettings";
import Modal from "./Modal";


interface SettingsDialogProps {
	isOpen: boolean;
	onClose: () => void;
	background: Background;
}

enum SettingsTab {
	Background,
	About
}

declare type SettingsTabType = keyof typeof SettingsTab;

function getTitleForTab(tab: SettingsTab) {
	switch (tab) {
	case SettingsTab.Background:
		return "Background";
	case SettingsTab.About:
		return "About and Credits";
	}
}

function getComponentForTab(tab: SettingsTab) {
	switch (tab) {
	case SettingsTab.Background:
		return BackgroundSettings;
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
				<a key={tabName} onClick={() => setTab(tab)} className={isSelected ? "active" : ""}>
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
