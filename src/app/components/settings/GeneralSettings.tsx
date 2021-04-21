import React from "react";
import { FormattedMessage } from "react-intl";


export default function GeneralSettings() {
	return (
		<div className="modal-body">
			<h2>
				<FormattedMessage defaultMessage="General" />
			</h2>
			<div className="field">
				<label htmlFor="locale">
					<FormattedMessage defaultMessage="Language" />
				</label>
				<select>
					<option selected>English (en)</option>
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
