import React from "react";
import { FormattedMessage } from "react-intl";
import { AnalyticsConsentContent, analyticsConsentMessages } from "app/components/AnalyticsConsent";


export default function OnboardingAnalytics() {
	return (
		<div className="modal-body onboarding">
			<h3>
				<FormattedMessage {...analyticsConsentMessages.title} />
			</h3>
			<AnalyticsConsentContent />
		</div>);
}
