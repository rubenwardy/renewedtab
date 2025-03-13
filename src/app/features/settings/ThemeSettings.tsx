import { storage } from "app/storage";
import Color from "app/utils/Color";
import Schema, { type } from "app/utils/Schema";
import React, { useMemo } from "react";
import { defineMessages } from "react-intl";
import Button, { ButtonVariant } from "app/components/Button";
import { Form } from "app/components/forms";
import { ColorPair } from "app/components/forms/ColorFields";
import { schemaMessages } from "app/locale/common";


const messages = defineMessages({
	resetTheme: {
		defaultMessage: "Reset theme to default",
	},

	font: {
		defaultMessage: "Font",
		description: "Theme settings: form field label",
	},

	fontHint: {
		defaultMessage: "Any font name installed on your computer",
		description: "Theme settings: form field hint (Font)",
	},

	baseBorderRadius: {
		defaultMessage: "Border Radius",
		description: "Theme settings: form field label",
	},

	baseBorderRadiusHint: {
		defaultMessage: "How rounded should the edges of most things be? From 0% to 300%",
		description: "Theme settings: form field hint (Border Radius)",
	},

	panelBorderRadius: {
		defaultMessage: "Panel Border Radius",
		description: "Theme settings: form field label",
	},

	panelBorderRadiusHint: {
		defaultMessage: "How rounded should the edges of panels (eg: widgets) be? From 0% to 1000%",
		description: "Theme settings: form field hint (Border Radius)",
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

	customCSS: {
		defaultMessage: "Custom CSS",
		description: "Theme settings: form field label",
	},

	customCSSHint: {
		defaultMessage: "Please note: this is an experimental feature and CSS selectors may break in future releases.",
		description: "Theme settings: form field hint (Custom CSS)",
	},

	customCSSLink: {
		defaultMessage: "CSS documentation",
		description: "Theme settings: link to CSS docs",
	},
});


export interface ThemeConfig {
	fontFamily?: string;
	fontScaling?: number;
	baseBorderRadius?: number;
	panelBorderRadius?: number;
	panelBlurRadius?: number;
	panelOpacity?: number;
	colorPrimaryPair?: ColorPair;
	customCSS?: string;
}

const defaults: ThemeConfig = {
	fontFamily: "Roboto",
	fontScaling: 100,
	baseBorderRadius: 100,
	panelBorderRadius: 100,
	panelBlurRadius: 12,
	panelOpacity: 50,
	colorPrimaryPair: { one: "#007DB8", two: "#67cee5" },
	customCSS: undefined,
};


export interface ThemeSettingsProps {
	theme: ThemeConfig | null;
	setTheme: (conf: ThemeConfig) => void;
}

export function ThemeSettings(props: ThemeSettingsProps) {
	const theme = useMemo<ThemeConfig>(
		() => Object.assign({}, defaults, props.theme),
		[ props.theme ]);

	function handleOnChange(key: keyof ThemeConfig, value: any) {
		props.theme![key] = value;
		props.setTheme(props.theme!);
	}

	async function resetTheme() {
		await storage.remove("theme");
		location.reload();
	}

	return (
		<>
			<p>
				<Button variant={ButtonVariant.Secondary} onClick={resetTheme}
					label={messages.resetTheme} />
			</p>
			<Form values={theme} schema={getThemeSchema()}
				onChange={handleOnChange} />
			<Button href="https://renewedtab.com/help/css/" target="_blank"
				variant={ButtonVariant.Secondary}
				label={messages.customCSSLink} />
		</>);
}


function getThemeSchema(): Schema<ThemeConfig> {
	const supportsBackdropFilter =
		CSS.supports("backdrop-filter: brightness(70%) contrast(110%) saturate(140%) blur(12px)");

	return {
		fontFamily: type.string(messages.font, messages.fontHint),
		fontScaling: type.unit_number(schemaMessages.fontScaling, "%", undefined, 80, 200),
		baseBorderRadius: type.unit_number(messages.baseBorderRadius, "%", messages.baseBorderRadiusHint, 0, 300),
		panelBorderRadius: type.unit_number(messages.panelBorderRadius, "%", messages.panelBorderRadiusHint, 0, 1000),
		panelBlurRadius: supportsBackdropFilter ? type.unit_number(messages.panelBlurRadius, "px", undefined, 0) : undefined,
		panelOpacity: type.unit_number(messages.panelOpacity, "%", undefined, 0, 100),
		colorPrimaryPair: type.colorPair(messages.colorPrimary, messages.colorPrimaryHint),
		customCSS: type.textarea(messages.customCSS, messages.customCSSHint),
	};
}


export function applyTheme(theme: ThemeConfig) {
	theme = Object.assign({}, defaults, theme);

	const fontScaling = Math.max(Math.min(theme.fontScaling!, 200), 80);

	const colorPrimaryDark = Color.fromString(theme.colorPrimaryPair!.one!)!;
	const colorPrimaryLight = Color.fromString(theme.colorPrimaryPair!.two!)!;

	const style = document.documentElement.style;
	style.setProperty("--font-family", theme.fontFamily!);
	style.setProperty("--font-size", `${fontScaling}%`);
	style.setProperty("--base-border-radius", `${(theme.baseBorderRadius ?? 100) * 0.25 / 100}rem`);
	style.setProperty("--panel-border-radius", `${(theme.panelBorderRadius ?? 100) * 0.25 / 100}rem`);
	style.setProperty("--panel-blur", `${theme.panelBlurRadius}px`);
	style.setProperty("--panel-opacity", `${theme.panelOpacity}%`);
	style.setProperty("--color-primary-dark", colorPrimaryDark.hex);
	style.setProperty("--color-primary-dark-highlight", colorPrimaryDark.lighten(1.3).hex);
	style.setProperty("--color-primary-light", colorPrimaryLight.hex);
	style.setProperty("--color-primary-light-highlight", colorPrimaryLight!.lighten(1.3).hex);

	let customStyles = document.getElementById("custom-css");
	if (!customStyles) {
		customStyles = document.createElement("style");
		customStyles.id = "custom-css";
		document.body.appendChild(customStyles);
	}
	customStyles.textContent = theme.customCSS ?? "";
}
