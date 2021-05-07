import React, { ChangeEvent } from "react";
import { FormattedMessage } from "react-intl";

export interface GeneralSettingsProps {
	locale: string;
	setLocale: (locale: string) => void;
}


export default function GeneralSettings(props: GeneralSettingsProps) {
	function onChange(e: ChangeEvent<HTMLSelectElement>) {
		const selectedIndex = e.target.options.selectedIndex;
		const locale = e.target.options[selectedIndex].getAttribute("value");
		if (locale) {
			props.setLocale(locale);
		}
	}

	return (
		<div className="modal-body">
			<h2>
				<FormattedMessage defaultMessage="General" />
			</h2>
			<div className="field">
				<label htmlFor="locale">
					<FormattedMessage defaultMessage="Language" />
				</label>
				<select value={props.locale} onChange={onChange}>
					<option key="en" value="en">English (en)</option>
					<option key="tr" value="tr">Türkçe (tr)</option>
				</select>
				<p className="text-muted">
					<FormattedMessage
						defaultMessage="Consider <a>adding support for your language</a>."
						values={{
							a: (chunk: any) => (
								<a href="https://renewedtab.rubenwardy.com/translations/">{chunk}</a>)
						}} />
				</p>
			</div>
		</div>);
}
