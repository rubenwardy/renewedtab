import React from "react";
import { render } from "react-dom";
import App from "./components/App";
import "./scss/main.scss";

import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";

Sentry.init({
	enabled: config.SENTRY_DSN !== undefined,
	dsn: config.SENTRY_DSN,
	integrations: [new Integrations.BrowserTracing()],

	debug: is_debug,
	environment: is_debug ? "debug" : "production",
	release: `renewedtab@${app_version}`,

	beforeSend(event) {
		if ((event.exception?.values ?? []).some(x => x.type == "UserError")) {
			return null;
		}

		return event;
	}
});

render(
  <App />,
  document.getElementById("app")
);


import { library, dom } from '@fortawesome/fontawesome-svg-core'
import { faPlus, faCog, faTimes, faPen, faTrash, faCaretUp, faCaretDown,
	faEllipsisH, faCircle, faGlobeEurope, faBan, faThumbsUp, faLock,
	faLockOpen, faQuestionCircle, faGripVertical } from '@fortawesome/free-solid-svg-icons'
import { getFeedbackURL } from "./utils/webext";

library.add(faPlus, faCog, faTimes, faPen, faTrash, faCaretUp, faCaretDown,
	faEllipsisH, faCircle, faGlobeEurope, faBan, faThumbsUp, faLock, faLockOpen,
	faQuestionCircle, faGripVertical);
dom.watch();


if (typeof browser !== "undefined") {
	async function setUninstallURL() {
		browser.runtime.setUninstallURL(await getFeedbackURL("uninstall"));
	}

	setUninstallURL().catch(console.error);
}
