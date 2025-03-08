
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";


export function getIsSentryEnabled(): boolean {
	return localStorage.getItem("_sentry-opt-out") !== "yes";
}


export function setSentryEnabled(v: boolean) {
	if (v) {
		localStorage.removeItem("_sentry-opt-out");
	} else {
		localStorage.setItem("_sentry-opt-out", "yes");
		Sentry.close();
	}
}


export function initSentry() {
	Sentry.init({
		enabled: config.SENTRY_DSN !== undefined && getIsSentryEnabled(),
		dsn: config.SENTRY_DSN,
		integrations: [
			new Integrations.BrowserTracing({
				tracingOrigins: [new URL(config.API_URL).host],
			})
		],

		debug: app_version.is_debug,
		environment: app_version.environment,
		release: `renewedtab@${app_version.version}`,

		beforeSend(event) {
			const exceptions = event.exception?.values ?? [];

			// Drop expected UserError exceptions
			if (exceptions.some(x => x.type == "UserError")) {
				return null;
			}

			const whitelistedMessages = [
				"ResizeObserver loop completed with undelivered notifications",
				"ResizeObserver loop limit exceeded",
			];
			if (exceptions.some(x => x.value && whitelistedMessages.some(y => x.value!.includes(y)))) {
				return null;
			}

			return event;
		},

		beforeBreadcrumb(crumb) {
			if (crumb.type !== "http") {
				return crumb;
			}

			try {
				const url = new URL(crumb.data!.url);
				for (const key of ["lat", "long"]) {
					if (url.searchParams.has(key)) {
						url.searchParams.set(key, "*****");
					}
				}

				crumb.data!.url = url.toString();
			} catch (e) {
				console.error(e);
			}

			return crumb;
		},
	});
}
