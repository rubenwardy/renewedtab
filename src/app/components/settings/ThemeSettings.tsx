import { storage } from "app/Storage";
import Color from "app/utils/Color";
import Schema, { type } from "app/utils/Schema";
import React, { useMemo } from "react";
import { defineMessages, FormattedMessage } from "react-intl";
import { Form } from "../forms";
import { ColorPair } from "../forms/ColorFields";
import { tabTitles, SettingsTab } from "./SettingsDialog";


const messages = defineMessages({
	experimental: {
		defaultMessage: "The following settings are <b>experimental</b>; this means that you may encounter bugs and weirdness when changing them, and updates may break your themes.",
		description: "Theme settings",
	},

	font: {
		defaultMessage: "Font",
		description: "Theme settings: form field label",
	},

	fontHint: {
		defaultMessage: "Any font name installed on your computer",
		description: "Theme settings: form field hint (Font)",
	},

	fontScaling: {
		defaultMessage: "Font Scaling",
		description: "Theme settings: form field label",
	},

	panelBlurRadius: {
		defaultMessage: "Panel Blur Radius",
		description: "Theme settings: form field label",
	},

	panelOpacity: {
		defaultMessage: "Panel Background Darkness",
		description: "Theme settings: form field label",
	},

	colorPrimary: {
		defaultMessage: "Primary Color",
		description: "Theme settings: form field label",
	},

	colorPrimaryHint: {
		defaultMessage: "Used for primary buttons and links",
		description: "Theme settings: form field hint (Primary Color)",
	},
});


export interface ThemeConfig {
	fontFamily?: string;
	fontScaling?: number;
	panelBlurRadius?: number;
	panelOpacity?: number;
	colorPrimaryPair?: ColorPair;
}

const defaults: ThemeConfig = {
	fontFamily: "Roboto",
	fontScaling: 100,
	panelBlurRadius: 12,
	panelOpacity: 50,
	colorPrimaryPair: { one: "#007DB8", two: "#67cee5" },
};


export interface ThemeSettingsProps {
	theme: ThemeConfig | null;
	setTheme: (conf: ThemeConfig) => void;
}

export function ThemeSettings(props: ThemeSettingsProps) {
	const theme = useMemo<ThemeConfig>(
		() => Object.assign({}, defaults, props.theme),
		[ props.theme ]);

	function handleOnChange(key: string, value: any) {
		(props.theme as any)[key] = value;
		props.setTheme(props.theme!);
	}

	async function resetTheme() {
		await storage.remove("theme");
		location.reload();
	}

	return (
		<div className="modal-body">
			<h2>
				<FormattedMessage {...tabTitles[SettingsTab.Theme]} />
			</h2>
			<p className="text-muted">
				<FormattedMessage {...messages.experimental}
					values={{ b: (chunk: any) => (<b>{chunk}</b>) }} />
			</p>
			<p>
				<a className="btn btn-secondary" onClick={resetTheme}>
					<FormattedMessage defaultMessage="Reset theme to default" />
				</a>
			</p>
			<Form values={theme} schema={getThemeSchema()}
						onChange={handleOnChange} />
		</div>);
}


function getThemeSchema(): Schema {
	const supportsBackdropFilter =
		CSS.supports("backdrop-filter: brightness(70%) contrast(110%) saturate(140%) blur(12px)");

	if (supportsBackdropFilter) {
		return {
			fontFamily: type.string(messages.font, messages.fontHint),
			fontScaling: type.unit_number(messages.fontScaling, "%"),
			panelBlurRadius: type.unit_number(messages.panelBlurRadius, "px"),
			panelOpacity: type.unit_number(messages.panelOpacity, "%"),
			colorPrimaryPair: type.colorPair(messages.colorPrimary, messages.colorPrimaryHint),
		};
	} else {
		return {
			fontFamily: type.string(messages.font, messages.fontHint),
			fontScaling: type.unit_number(messages.fontScaling, "%"),
			panelOpacity: type.unit_number(messages.panelOpacity, "%"),
			colorPrimaryPair: type.colorPair(messages.colorPrimary, messages.colorPrimaryHint),
		};
	}
}


export function applyTheme(theme: ThemeConfig) {
	theme = Object.assign({}, defaults, theme);

	const fontScaling = Math.max(Math.min(theme.fontScaling!, 200), 80);

	const colorPrimaryDark = Color.fromString(theme.colorPrimaryPair!.one!)!;
	const colorPrimaryLight = Color.fromString(theme.colorPrimaryPair!.two!)!;

	const style = document.documentElement.style;
	style.setProperty("--font-family", theme.fontFamily!);
	style.setProperty("--font-size", `${fontScaling}%`);
	style.setProperty("--panel-blur", `${theme.panelBlurRadius}px`);
	style.setProperty("--panel-opacity", `${theme.panelOpacity}%`);
	style.setProperty("--color-primary-dark", colorPrimaryDark.hex);
	style.setProperty("--color-primary-dark-highlight", colorPrimaryDark.lighten(1.3).hex);
	style.setProperty("--color-primary-light", colorPrimaryLight.hex);
	style.setProperty("--color-primary-light-highlight", colorPrimaryLight!.lighten(1.3).hex);
}
