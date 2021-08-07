import React, { useState } from "react";
import AboutSettings from "./AboutSettings";
import BackgroundSettings, { BackgroundSettingsProps } from "./BackgroundSettings";
import Modal from "../Modal";
import ImportExport from "./ImportExport";
import { defineMessages, FormattedMessage, useIntl } from "react-intl";
import { ThemeSettings, ThemeSettingsProps } from "./ThemeSettings";
import GeneralSettings, { GeneralSettingsProps } from "./GeneralSettings";


export enum SettingsTab {
	General,
	Background,
	Theme,
	ImportExport,
	About,
}


declare type SettingsTabType = keyof typeof SettingsTab;

export const tabTitles = defineMessages({
	[SettingsTab.General]: {
		defaultMessage: "General",
		description: "Settings tab",
	},

	[SettingsTab.Background]: {
		defaultMessage: "Background",
		description: "Settings tab",
	},

	[SettingsTab.Theme]: {
		defaultMessage: "Theme",
		description: "Settings tab",
	},

	[SettingsTab.ImportExport]: {
		defaultMessage: "Import / Export",
		description: "Settings tab",
	},

	[SettingsTab.About]: {
		defaultMessage: "About and Help",
		description: "Settings tab",
	},
});


function getComponentForTab(tab: SettingsTab) {
	switch (tab) {
	case SettingsTab.General:
		return GeneralSettings;
	case SettingsTab.Background:
		return BackgroundSettings;
	case SettingsTab.Theme:
		return ThemeSettings;
	case SettingsTab.ImportExport:
		return ImportExport;
	case SettingsTab.About:
		return AboutSettings;
	}
}


interface SettingsDialogProps extends BackgroundSettingsProps,
		ThemeSettingsProps, GeneralSettingsProps {
	isOpen: boolean;
	onClose: () => void;
}

export default function SettingsDialog(props: SettingsDialogProps) {
	const [currentTab, setTab] = useState(SettingsTab.General);

	const tabs = Object.keys(SettingsTab)
		.filter(value => isNaN(Number(value)))
		.map(tabName => {
			const tab = SettingsTab[tabName as SettingsTabType];
			const isSelected = tab == currentTab;
			return (
				<a key={tabName} onClick={() => setTab(tab)}
						className={isSelected ? "active" : undefined}>
					<FormattedMessage {...tabTitles[tab]} />
				</a>)
		});

	const intl = useIntl();
	const Tab = getComponentForTab(currentTab);

	return (
		<Modal title={intl.formatMessage({ defaultMessage: "Settings "})}
				wide={true} {...props}>
			<div className="modal-flex">
				<nav>
					{tabs}
				</nav>
				<Tab {...props} />
			</div>
		</Modal>);
}
