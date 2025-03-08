import React from "react";
import { render } from "react-dom";
import App from "./components/App";
import "./scss/main.scss";
import { getFeedbackURL } from "./utils/webext";
import { initSentry }  from "./sentry";

initSentry();

render(
	<App />,
	document.getElementById("app")
);


import { library, dom } from '@fortawesome/fontawesome-svg-core'
import {
	faPlus, faCog, faTimes, faPen, faTrash, faCaretUp, faCaretDown,
	faCaretLeft, faCaretRight, faEllipsisH, faCircle, faGlobeEurope, faBan,
	faThumbsUp, faQuestionCircle, faGripVertical, faLanguage, faTint, faSun,
	faWind, faLongArrowAltRight, faClone, faSearch, faUmbrella,
	faCircleQuestion, faQuestion, faCheck, faFolder, faGrip, faImage,
	faPaintBrush, faRightLeft
} from '@fortawesome/free-solid-svg-icons'

library.add(faPlus, faCog, faTimes, faPen, faTrash, faCaretUp, faCaretDown,
	faCaretLeft, faCaretRight, faEllipsisH, faCircle, faGlobeEurope, faBan,
	faThumbsUp, faCheck, faQuestionCircle, faGripVertical,
	faLanguage, faTint, faSun, faWind, faLongArrowAltRight, faClone, faSearch,
	faUmbrella, faCircleQuestion, faQuestion, faFolder, faGrip, faImage,
	faPaintBrush, faRightLeft);
dom.watch();


if (typeof browser !== "undefined") {
	async function setUninstallURL() {
		browser.runtime.setUninstallURL(await getFeedbackURL("uninstall"));
	}

	setUninstallURL().catch(console.error);
}
