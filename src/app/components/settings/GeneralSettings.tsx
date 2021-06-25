import { getLanguages } from "app/locale";
import React, { ChangeEvent, useState } from "react";
import { defineMessages, FormattedMessage } from "react-intl";
import Button, { ButtonVariant } from "../Button";
import { Form } from "../forms";
import { gridSettingsSchema, WidgetGridSettings } from "../WidgetGrid";
import { tabTitles, SettingsTab } from "./SettingsDialog";


const messages = defineMessages({
	privacyPolicy: {
		defaultMessage: "Privacy Policy",
		description: "General settings: privacy policy button",
	},
})


export interface GeneralSettingsProps {
	locale: string;
	setLocale: (locale: string) => void;

	grid?: WidgetGridSettings;
	setGrid: (grid: WidgetGridSettings) => void;
}


export default function GeneralSettings(props: GeneralSettingsProps) {
	const [sentryEnabled, setSentryEnabled] =
		useState(localStorage.getItem("_sentry-opt-out") != "yes");

	function onLocaleChange(e: ChangeEvent<HTMLSelectElement>) {
		const selectedIndex = e.target.options.selectedIndex;
		const locale = e.target.options[selectedIndex].getAttribute("value");
		if (locale) {
			props.setLocale(locale);
		}
	}

	function onSentryEnabledChanged(e: ChangeEvent<HTMLInputElement>) {
		if (e.target.checked) {
			localStorage.removeItem("_sentry-opt-out");
		} else {
			localStorage.setItem("_sentry-opt-out", "yes");
		}
		setSentryEnabled(e.target.checked);
	}

	function handleSetGridValue(key: string, val: any) {
		(props.grid as any)[key] = val;
		props.setGrid({ ...props.grid! });
	}

	return (
		<div className="modal-body">
			<h2>
				<FormattedMessage {...tabTitles[SettingsTab.General]} />
			</h2>
			<div className="field">
				<label htmlFor="locale">
					<FormattedMessage defaultMessage="Language" />
				</label>
				<select value={props.locale} onChange={onLocaleChange}>
					{Object.entries(getLanguages()).map(([key, title]) =>
						<option key={key} value={key}>{title}</option>)}
				</select>
				<p className="text-muted">
					<FormattedMessage
						defaultMessage="Translations are provided by the community."
						values={{
							a: (chunk: any) => (
								<a href="https://renewedtab.com/translations/">{chunk}</a>)
						}} /><br />
					<FormattedMessage
						defaultMessage="Consider <a>contributing or adding your language</a>."
						values={{
							a: (chunk: any) => (
								<a href="https://renewedtab.com/translations/">{chunk}</a>)
						}} />
				</p>
			</div>

			<Form
				values={props.grid!}
				schema={gridSettingsSchema}
				onChange={handleSetGridValue} />

			<h3 className="label">
				<FormattedMessage
					defaultMessage="Privacy"
					description="General settings: privacy" />
			</h3>

			<div className="field">
				<label className="inline" htmlFor="sentry-enabled">
					<input name="sentry-enabled" className="mr-2"
						type="checkbox" checked={sentryEnabled}
						onChange={onSentryEnabledChanged} />
					<FormattedMessage
						defaultMessage="Enable crash reporting (using Sentry)"
						description="General settings: enable sentry" />
				</label>
				<p>
					<Button label={messages.privacyPolicy}
						variant={ButtonVariant.Secondary} target="_blank"
						href="https://renewedtab.com/privacy_policy/" />
				</p>
			</div>
		</div>);
}
