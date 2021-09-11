import { getLanguages } from "app/locale";
import React, { ChangeEvent } from "react";
import { FormattedMessage } from "react-intl";
import { OnboardingPageProps } from ".";


export default function OnboardingWelcome(props: OnboardingPageProps) {
	function onLocaleChange(e: ChangeEvent<HTMLSelectElement>) {
		const selectedIndex = e.target.options.selectedIndex;
		const locale = e.target.options[selectedIndex].getAttribute("value");
		if (locale) {
			props.setLocale(locale);
		}
	}

	return (
		<div className="modal-body onboarding">
			<div className="row row-gap features">
				<div className="one-half middle-center iconx">
					<img className="w-50" src="icon.svg" />
				</div>
				<div className="one-half middle-center">
					<div>
						<p className="mt-0 mb-4">
							<FormattedMessage
									defaultMessage="Welcome to <a>Renewed Tab</a>: a customisable New Tab page, with widgets and beautiful backgrounds."
									values={{
										a: (chunk: any) => (<a href="https://renewedtab.com">{chunk}</a>)
									}} />
						</p>
						<div className="field mt-6">
							<label htmlFor="locale">
								<i className="fas fa-language mr-2" />
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
									}} />
								{props.locale == "en" ? <br /> : " "}
								<FormattedMessage
									defaultMessage="Consider <a>contributing or adding your language</a>."
									values={{
										a: (chunk: any) => (
											<a href="https://renewedtab.com/translations/">{chunk}</a>)
									}} />
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>);
}
