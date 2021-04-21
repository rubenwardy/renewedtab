import Schema, { type } from "app/utils/Schema";
import React, { useMemo } from "react";
import { defineMessages, FormattedMessage } from "react-intl";
import { Form } from "../forms";


const messages = defineMessages({
	experimental: {
		defaultMessage: "The following settings are experimental. This means that you may encounter bugs and weirdness when changing them.",
	},

	requiresReload: {
		defaultMessage: "These settings require a page reload to take affect.",
	},

	font: {
		defaultMessage: "Font",
	},

	fontHint: {
		defaultMessage: "Any font name installed on your computer",
	},

	fontScaling: {
		defaultMessage: "Font Scaling",
	},

	blurRadius: {
		defaultMessage: "Panel Blur radius",
	},

	colorPrimary: {
		defaultMessage: "Primary Color",
	},

	colorPrimaryHint: {
		defaultMessage: "Used for primary buttons and links",
	},

	colorPrimaryHighlight: {
		defaultMessage: "Primary Color Highlight",
	},

	colorPrimaryHighlightHint: {
		defaultMessage: "Used when hovering over a primary button or link",
	},
});


export interface ThemeConfig {
	fontFamily?: string;
	fontScaling?: number;
	blurRadius?: number;
	colorPrimary?: string;
	colorPrimaryHighlight?: string;
}

const defaults: ThemeConfig = {
	fontFamily: "Roboto",
	fontScaling: 100,
	blurRadius: 12,
	colorPrimary: "#007DB8",
	colorPrimaryHighlight: "#06aed5",
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
			<p className="text-muted">
				<FormattedMessage {...messages.requiresReload} />
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
			blurRadius: type.unit_number(messages.blurRadius, "px"),
			colorPrimary: type.color(messages.colorPrimary, messages.colorPrimaryHint),
			colorPrimaryHighlight: type.color(messages.colorPrimaryHighlight, messages.colorPrimaryHighlightHint),
		};
	} else {
		return {
			fontFamily: type.string(messages.font, messages.fontHint),
			fontScaling: type.unit_number(messages.fontScaling, "%"),
			colorPrimary: type.color(messages.colorPrimary, messages.colorPrimaryHint),
			colorPrimaryHighlight: type.color(messages.colorPrimaryHighlight, messages.colorPrimaryHighlightHint),
		};
	}
}


export function applyTheme(theme: ThemeConfig) {
	theme = Object.assign({}, defaults, theme);

	const fontScaling = Math.max(Math.min(theme.fontScaling!, 200), 80);

	const style = document.documentElement.style;
	style.setProperty("--font-family", theme.fontFamily!);
	style.setProperty("--font-size", `${fontScaling}%`);
	style.setProperty("--panel-blur", `${theme.blurRadius}px`);
	style.setProperty("--color-primary", theme.colorPrimary!);
	style.setProperty("--color-primary-highlight", theme.colorPrimaryHighlight!);
}
