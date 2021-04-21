import Schema, { type } from "app/utils/Schema";
import React, { useMemo } from "react";
import { defineMessages, FormattedMessage } from "react-intl";
import { Form } from "../forms";


const messages = defineMessages({
	font: {
		defaultMessage: "Font",
	},

	fontHint: {
		defaultMessage: "Any font name installed on your computer",
	},

	fontScaling: {
		defaultMessage: "Font Scaling",
	},

	fontScalingHint: {
		defaultMessage: "Requires a page reload.",
	},

	blurRadius: {
		defaultMessage: "Panel Blur radius",
	},

	experimental: {
		defaultMessage: "The following settings are experimental. This means that you may encounter bugs and weirdness when changing them.",
	},
});


export interface ThemeConfig {
	fontFamily?: string;
	fontScaling?: number;
	blurRadius?: number;
}

const defaults: ThemeConfig = {
	fontFamily: "Roboto",
	fontScaling: 100,
	blurRadius: 12,
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

	return (
		<div className="modal-body">
			<h2>
				<FormattedMessage defaultMessage="Theme" />
			</h2>
			<p className="text-muted">
				<FormattedMessage {...messages.experimental} />
			</p>
			<Form values={theme} schema={themeSchema}
						onChange={handleOnChange} />
		</div>);
}


const themeSchema: Schema = {
	fontFamily: type.string(messages.font, messages.fontHint),
	fontScaling: type.unit_number(messages.fontScaling, "%",
			messages.fontScalingHint),
	blurRadius: type.unit_number(messages.blurRadius, "px"),
};


export function applyTheme(theme: ThemeConfig) {
	theme = Object.assign({}, defaults, theme);

	const fontScaling = Math.max(Math.min(theme.fontScaling!, 200), 80);

	const style = document.documentElement.style;
	style.setProperty("--font-family", theme.fontFamily!);
	style.setProperty("--font-size", `${fontScaling}%`);
	style.setProperty("--panel-blur", `${theme.blurRadius}px`);
}
