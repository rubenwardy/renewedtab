export const ANALYTICS_CONSENT_CHOICES = ["allow", "deny"] as const;
export type AnalyticsConsentChoice = typeof ANALYTICS_CONSENT_CHOICES[number];

export const ANALYTICS_CONSENT_SOURCES = ["onboarding", "existing_user_modal", "settings"] as const;
export type AnalyticsConsentSource = typeof ANALYTICS_CONSENT_SOURCES[number];

export interface AnalyticsConsentAnswer {
	choice: AnalyticsConsentChoice;
	source: AnalyticsConsentSource;
}
