import posthog, { CaptureResult } from "posthog-js/dist/module.full.no-external";
import { storage } from "app/storage";
import { ONE_DAY_MS } from "app/utils/dates";
import { clearAnalyticsConsentBucket } from "./consentRolloutBucket";
import { getIsTechnicalDataAllowed, onTechnicalDataRevoked, technicalDataChecked } from "app/utils/dataCollection";

const projectToken = config.POSTHOG_PROJECT_TOKEN;
const host = config.POSTHOG_HOST;
export const isPosthogEnabled = !!(projectToken && host);
let posthogReady: Promise<void> = Promise.resolve();

// Remove URL as Firefox uses a per-install UUID in its URL
const URL_PROPERTIES = ["$current_url", "$host", "$pathname", "$referrer", "$referring_domain"];

function removeInitialURLProperties(event: CaptureResult | null): CaptureResult | null {
	for (const props of [event?.$set, event?.$set_once]) {
		for (const key of URL_PROPERTIES) {
			delete props?.[`$initial_${key.slice(1)}`];
		}
	}
	return event;
}

if (!projectToken || !host) {
	if (app_version.is_debug) {
		const missingVariable = projectToken ? "POSTHOG_HOST" : "POSTHOG_PROJECT_TOKEN";
		console.warn(`${missingVariable} is not configured, so PostHog analytics are disabled`);
	}
} else {
	posthog.init(projectToken, {
		api_host: host,
		defaults: "2026-05-30",
		capture_exceptions: false,
		autocapture: false,
		rageclick: false,
		capture_dead_clicks: false,
		capture_heatmaps: false,
		capture_pageview: false,
		capture_pageleave: false,
		capture_performance: false,
		disable_session_recording: true,
		disable_surveys: true,
		disable_web_experiments: true,
		disable_external_dependency_loading: true,
		advanced_disable_flags: true,
		opt_out_capturing_by_default: true,
		opt_out_persistence_by_default: true,
		property_denylist: URL_PROPERTIES,
		before_send: removeInitialURLProperties,
		logs: {
			serviceName: "renewed-tab-extension",
			environment: app_version.environment,
			serviceVersion: app_version.version,
			captureConsoleLogs: false,
		},
	});

	if (posthog.has_opted_in_capturing()) {
		posthogReady = startOptedIn().catch(console.error);
	}

	onTechnicalDataRevoked(() => posthog.opt_out_capturing());
}

async function startOptedIn() {
	await technicalDataChecked;
	if (!getIsTechnicalDataAllowed()) {
		posthog.opt_out_capturing();
		return;
	}

	await registerSuperProperties();
}

async function registerSuperProperties() {
	posthog.register({ extension_version: app_version.version });
	await registerInstallAge();
}

export function getIsPosthogConsentPending(): boolean {
	return isPosthogEnabled && posthog.get_explicit_consent_status() == "pending";
}

export function getIsPosthogOptedIn(): boolean {
	return isPosthogEnabled && posthog.has_opted_in_capturing();
}

export function setPosthogOptedIn(v: boolean) {
	if (!isPosthogEnabled) {
		return;
	}

	if (v) {
		posthog.opt_in_capturing();
		posthogReady = registerSuperProperties().catch(console.error);
	} else {
		posthog.opt_out_capturing();
	}

	clearAnalyticsConsentBucket().catch(console.error);
}

export function getPosthogDistinctId(): string {
	return posthog.get_distinct_id();
}

interface ReviewRequestInfo {
	installDate?: Date;
}

async function getInstallDate(): Promise<Date> {
	let installDate = await storage.get<Date>("install_date");
	if (!installDate) {
		const reviewRequestInfo = await storage.get<ReviewRequestInfo>("review_request");
		installDate = reviewRequestInfo?.installDate ?? new Date();
		await storage.set("install_date", installDate);
	}
	return installDate;
}

async function registerInstallAge() {
	const installDate = await getInstallDate();
	const daysSinceInstall = Math.max(0,
		Math.floor((Date.now() - installDate.valueOf()) / ONE_DAY_MS));

	posthog.register({ days_since_install: daysSinceInstall });
	posthog.setPersonProperties(undefined, { install_date: installDate.toISOString() });
}

export function waitForPosthogReady(): Promise<void> {
	return posthogReady;
}

export default posthog;
