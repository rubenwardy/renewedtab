import React from "react";
import {createRoot} from "react-dom/client";
import App from "./features/app/App";
import "./scss/main.scss";
import { getFeedbackURL } from "./utils/webext";
import { initSentry }  from "./sentry";

initSentry();


createRoot(document.getElementById("app")!).render(<App />);


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

	setTimeout(() => {
		for (let i = 0; i < window.localStorage.length; i++) {
			const key = window.localStorage.key(i);
			if (key && key != "_sentry-opt-out") {
				window.localStorage.removeItem(key);
			}
		}
	}, 100);
}
