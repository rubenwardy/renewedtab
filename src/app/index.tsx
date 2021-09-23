import React from "react";
import { render } from "react-dom";
import App from "./components/App";
import "./scss/main.scss";
import { getFeedbackURL } from "./utils/webext";

import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";

Sentry.init({
	enabled: config.SENTRY_DSN !== undefined,
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
		// Drop expected UserError exceptions
		if ((event.exception?.values ?? []).some(x => x.type == "UserError")) {
			return null;
		}

		// Read opt-out setting from localStorage
		// (localStorage is used because it is synchronous)
		if (localStorage.getItem("_sentry-opt-out") == "yes") {
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
			for (const key of [ "lat", "long" ]) {
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

render(
  <App />,
  document.getElementById("app")
);


import { library, dom } from '@fortawesome/fontawesome-svg-core'
import { faPlus, faCog, faTimes, faPen, faTrash, faCaretUp, faCaretDown,
	faEllipsisH, faCircle, faGlobeEurope, faBan, faThumbsUp, faLock,
	faLockOpen, faQuestionCircle, faGripVertical, faLanguage, faTint, faSun,
	faWind, faLongArrowAltRight, faClone } from '@fortawesome/free-solid-svg-icons'

library.add(faPlus, faCog, faTimes, faPen, faTrash, faCaretUp, faCaretDown,
	faEllipsisH, faCircle, faGlobeEurope, faBan, faThumbsUp, faLock, faLockOpen,
	faQuestionCircle, faGripVertical, faLanguage, faTint, faSun, faWind,
	faLongArrowAltRight, faClone);
dom.watch();


if (typeof browser !== "undefined") {
	async function setUninstallURL() {
		browser.runtime.setUninstallURL(await getFeedbackURL("uninstall"));
	}

	setUninstallURL().catch(console.error);
}


/**
 * Load Roboto font without blocking rendering
 */
const font = document.createElement("link")
font.href = "https://fonts.googleapis.com/css2?family=Roboto&display=swap";
font.rel = "preload";
font.as = "style";
document.body.appendChild(font);
font.onload = function() {
	console.log("Font loaded");
	font.onload = null;
	font.rel = 'stylesheet';
}
