import React, { useState } from "react";
import AboutSettings from "./AboutSettings";
import BackgroundSettings, { BackgroundSettingsProps } from "./BackgroundSettings";
import Modal from "app/components/Modal";
import ImportExport from "./ImportExport";
import { defineMessages, FormattedMessage, useIntl } from "react-intl";
import { ThemeSettings, ThemeSettingsProps } from "./ThemeSettings";
import GeneralSettings, { GeneralSettingsProps } from "./GeneralSettings";
import GridSettings, { GridSettingsProps } from "./GridSettings";


export enum SettingsTab {
	General,
	Grid,
	Background,
	Theme,
	ImportExport,
	About,
}

export const TabIcons: {[index: string]:any} = {
	"General": "gear",
	"Grid": "grip",
	"Background": "image",
	"Theme": "paint-brush",
	"ImportExport": "right-left",
	"About": "question",
}

declare type SettingsTabType = keyof typeof SettingsTab;

export const tabTitles = defineMessages({
	[SettingsTab.General]: {
		defaultMessage: "General",
		description: "Settings tab",
	},

	[SettingsTab.Grid]: {
		defaultMessage: "Widget Grid",
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
	case SettingsTab.Grid:
		return GridSettings;
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
		ThemeSettingsProps, GeneralSettingsProps, GridSettingsProps {
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
				<button id={`tab-${tabName}`} key={tabName} onClick={() => setTab(tab)}
						className={isSelected ? "active" : undefined}
						role="tab" aria-controls={"settings-panel"} aria-selected={isSelected}>
						<i className={`fas fa-${TabIcons[tabName]} mr-1`}> </i>
					<FormattedMessage {...tabTitles[tab]} />
				</button>)
		});

	const intl = useIntl();
	const Tab = getComponentForTab(currentTab);

	if (!props.isOpen) {
		return null;
	}

	return (
		<Modal title={intl.formatMessage({ defaultMessage: "Settings "})}
				wide={true} {...props}>
			<div className="modal-flex">
				<nav role="tablist">
					{tabs}
				</nav>
				<div className="modal-body" id="settings-panel" role="tabpanel">
					<Tab {...props} />
				</div>
			</div>
		</Modal>);
}
