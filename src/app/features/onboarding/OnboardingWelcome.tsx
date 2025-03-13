import { miscMessages } from "app/locale/common";
import React from "react";
import { FormattedMessage } from "react-intl";
import { OnboardingPageProps } from ".";
import LanguageSelector from "app/components/LanguageSelector";


export default function OnboardingWelcome(props: OnboardingPageProps) {
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
								{...miscMessages.welcome}
								values={{
									a: (chunk: any) => (<a href="https://renewedtab.com">{chunk}</a>)
								}} />
							. <FormattedMessage
									id="appDescription"
									defaultMessage="A customisable New Tab page, with widgets and beautiful backgrounds"
									description="App description" />
						</p>
						<LanguageSelector
							className="mt-6"
							locale={props.locale}
							setLocale={props.setLocale} />
					</div>
				</div>
			</div>
		</div>);
}
