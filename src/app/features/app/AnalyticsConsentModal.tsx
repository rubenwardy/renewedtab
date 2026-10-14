import React from "react";
import { useIntl } from "react-intl";
import Modal from "app/components/Modal";
import { AnalyticsConsentButtons, AnalyticsConsentContent, analyticsConsentMessages } from "app/components/AnalyticsConsent";
import { getRemoteConfig } from "app/remoteConfig";
import { getAnalyticsConsentBucket } from "app/analytics/consentRolloutBucket";


export async function getIsInAnalyticsConsentRollout(): Promise<boolean> {
	const percent = (await getRemoteConfig()).analytics_consent_rollout_percent;
	return percent > 0 && await getAnalyticsConsentBucket() < percent;
}


export default function AnalyticsConsentModal(props: { onDone: () => void }) {
	const intl = useIntl();

	return (
		<Modal title={intl.formatMessage(analyticsConsentMessages.title)} lighterBg={true}>
			<div className="modal-body">
				<AnalyticsConsentContent />
			</div>
			<div className="modal-footer text-right">
				<AnalyticsConsentButtons source="existing_user_modal" onDone={props.onDone} />
			</div>
		</Modal>);
}
