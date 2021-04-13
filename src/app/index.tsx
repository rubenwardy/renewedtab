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

library.add(faPlus, faCog, faTimes, faPen, faTrash, faCaretUp, faCaretDown,
	faEllipsisH, faCircle, faGlobeEurope, faBan, faThumbsUp, faLock, faLockOpen);
dom.watch();


if (typeof browser !== "undefined") {
	async function setUninstallURL() {
		const url = new URL("https://renewedtab.rubenwardy.com/uninstall/");

		try {
			const platform = await browser.runtime.getPlatformInfo();
			url.searchParams.set("platform", platform.os ?? '?');
		} catch (e) {
			console.error(e);
		}

		try {
			if (typeof browser.runtime.getBrowserInfo !== "undefined") {
				const browserInfo = await browser.runtime.getBrowserInfo()
				url.searchParams.set("browser", `${browserInfo.name} ${browserInfo.version}`);
			} else {
				url.searchParams.set("browser", "Chrome");
			}
		} catch (e) {
			console.error(e);
		}

		url.searchParams.set("version", app_version);

		browser.runtime.setUninstallURL(url.toString());
	}

	setUninstallURL().catch(console.error);
}
