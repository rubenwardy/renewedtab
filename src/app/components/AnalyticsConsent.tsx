import React from "react";
import { defineMessages, FormattedMessage } from "react-intl";
import Button, { ButtonVariant } from "app/components/Button";
import { setPosthogOptedIn } from "app/analytics/posthog";
import { requestTechnicalData } from "app/utils/dataCollection";
import { reportAnalyticsConsentAnswer } from "app/analytics/analyticsConsentStats";
import { AnalyticsConsentSource } from "common/api/analyticsConsent";


export const analyticsConsentMessages = defineMessages({
	title: {
		defaultMessage: "Help Improve Renewed Tab",
		description: "Usage statistics consent: title",
	},

	allowAnalytics: {
		defaultMessage: "Allow",
		description: "Usage statistics consent: allow button",
	},

	denyAnalytics: {
		defaultMessage: "Deny",
		description: "Usage statistics consent: deny button",
	},
});

export function AnalyticsConsentContent() {
	return (
		<>
			<p>
				<FormattedMessage
					defaultMessage="Would you like to share usage statistics? They show us which features are used, such as which widgets you add, so we know what to improve."
					description="Usage statistics consent: description" />
			</p>
			<p>
				<FormattedMessage
					defaultMessage="Statistics are sent to PostHog, our analytics provider, and are linked to a random ID stored in your browser. They never include the contents of your widgets, your bookmarks, or the websites you visit."
					description="Usage statistics consent: privacy" />
			</p>
			<p className="text-muted">
				<FormattedMessage
					defaultMessage="You can change this at any time in Settings. <a>Privacy Policy</a>"
					description="Usage statistics consent: hint"
					values={{
						a: (chunk: any) => (<a key={Math.random()} href="https://renewedtab.com/privacy_policy/" target="_blank" rel="noreferrer">{chunk}</a>)
					}} />
			</p>
		</>);
}

export interface AnalyticsConsentButtonsProps {
	source: AnalyticsConsentSource;
	onDone: () => void;
}

export function AnalyticsConsentButtons(props: AnalyticsConsentButtonsProps) {
	async function choose(v: boolean) {
		const allowed = v && await requestTechnicalData();
		setPosthogOptedIn(allowed);
		reportAnalyticsConsentAnswer(allowed ? "allow" : "deny", props.source);
		props.onDone();
	}

	return (
		<>
			<Button label={analyticsConsentMessages.denyAnalytics}
				variant={ButtonVariant.Primary}
				data-cy="analytics-deny"
				onClick={() => choose(false)} />
			<Button label={analyticsConsentMessages.allowAnalytics}
				variant={ButtonVariant.Primary}
				className="ml-2"
				data-cy="analytics-allow"
				onClick={() => choose(true)} />
		</>);
}
