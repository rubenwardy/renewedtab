interface Config {
	API_URL: string;
	PROXY_URL: string;
	PROXY_ALLOWED_HOSTS: string[];
}

declare global {
	const config: Config;
	const app_version: string;
}

import React from "react";
import { render } from "react-dom";
import App from "./components/App";
import "./scss/main.scss";

render(
  <App />,
  document.getElementById("app")
);


import { library, dom } from '@fortawesome/fontawesome-svg-core'
import { faPlus, faCog, faTimes, faPen, faTrash, faCaretUp, faCaretDown,
	faEllipsisH, faCircle, faGlobeEurope, faBan, faThumbsUp, faLock,
	faLockOpen } from '@fortawesome/free-solid-svg-icons'
import { getFeedbackURL } from "./utils/webext";

library.add(faPlus, faCog, faTimes, faPen, faTrash, faCaretUp, faCaretDown,
	faEllipsisH, faCircle, faGlobeEurope, faBan, faThumbsUp, faLock, faLockOpen);
dom.watch();


if (typeof browser !== "undefined") {
	async function setUninstallURL() {
		browser.runtime.setUninstallURL(await getFeedbackURL("uninstall"));
	}

	setUninstallURL().catch(console.error);
}
