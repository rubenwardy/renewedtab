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
