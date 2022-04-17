import { useForceUpdateValue } from "app/hooks";
import React, { ChangeEvent, useMemo, useState } from "react";
import { defineMessages, FormattedMessage } from "react-intl";
import Button, { ButtonVariant } from "../Button";
import { Form } from "../forms";
import LanguageSelector from "../LanguageSelector";
import { makeGridSettingsSchema, WidgetGridSettings } from "../WidgetGrid";


const messages = defineMessages({
	privacyPolicy: {
		defaultMessage: "Privacy Policy",
		description: "General settings: privacy policy button",
	},
})


export interface GeneralSettingsProps {
	locale: string;
	setLocale: (locale: string) => void;

	showBookmarksBar: boolean;
	setShowBookmarksBar: (value: boolean) => void;

	grid: WidgetGridSettings;
	setGrid: (grid: WidgetGridSettings) => void;
}


export default function GeneralSettings(props: GeneralSettingsProps) {
	const [sentryEnabled, setSentryEnabled] =
		useState(localStorage.getItem("_sentry-opt-out") != "yes");
	const [force, forceUpdate] = useForceUpdateValue();

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
		forceUpdate();
	}

	const gridSettingsSchema = useMemo(
		() => makeGridSettingsSchema(props.grid),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[props.grid, force]);

	return (
		<div className="modal-body">
			<p>
				<FormattedMessage
					defaultMessage="<b>Widgets also have settings</b>: hover over a widget and click the pencil to customise it."
					description="General settings: help message"
					values={{ b: (chunk: any) => (<b>{chunk}</b>) }} />
			</p>
			<LanguageSelector
				locale={props.locale}
				setLocale={props.setLocale} />

			<h3 className="label">
				<FormattedMessage
					defaultMessage="Bookmarks Bar"
					description="General settings: bookmarks bar" />
			</h3>
			<div className="field">
				<label className="inline" htmlFor="sshow-bookmarks-bar">
					<input name="show-bookmarks-bar" className="mr-2"
						type="checkbox" checked={props.showBookmarksBar}
						onChange={e => props.setShowBookmarksBar(e.target.checked)} />
					<FormattedMessage
						defaultMessage="Show bookmarks bar"
						description="General settings: bookmarks bar" />
				</label>
				<p className="text-muted">
					<FormattedMessage
						defaultMessage="Show a bookmarks bar at the top of the page."
						description="General settings: bookmarks bar" />&nbsp;
					<FormattedMessage
						defaultMessage="Note that you can instead use the Bookmarks widget for fine-grained control."
						description="General settings: bookmarks bar" />
				</p>
			</div>

			<Form
				values={props.grid}
				schema={gridSettingsSchema}
				onChange={handleSetGridValue} />

			<h3 className="label mt-6">
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
				<p className="mt-4">
					<Button label={messages.privacyPolicy}
						variant={ButtonVariant.Secondary} target="_blank"
						href="https://renewedtab.com/privacy_policy/" />
				</p>
			</div>
		</div>);
}
