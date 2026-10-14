import { buildAPIURL, fetchCheckCors } from "app/hooks/http";
import { isPosthogEnabled } from "app/analytics/posthog";
import { AnalyticsConsentAnswer, AnalyticsConsentChoice, AnalyticsConsentSource } from "common/api/analyticsConsent";


export function reportAnalyticsConsentAnswer(choice: AnalyticsConsentChoice,
		source: AnalyticsConsentSource): void {
	if (!isPosthogEnabled) {
		return;
	}

	const body: AnalyticsConsentAnswer = { choice, source };
	const url = buildAPIURL("/analytics-consent/");
	fetchCheckCors(new Request(url.toString(), {
		method: "POST",
		cache: "no-cache",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(body),
	})).catch(console.error);
}
