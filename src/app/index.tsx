interface Config {
	API_URL: string;
	PROXY_URL: string;
	PROXY_ALLOWED_HOSTS: string[];
}

declare global {
	var config: Config;
}

import React from "react";
import { render } from "react-dom";
import App from "./components/App";
import "./scss/main.scss";

render(
  <App />,
  document.getElementById("app")
);

window.onload = () => {
	if (typeof browser === "undefined") {
		document.title = "Homescreen Web";
	}
};

import { library, dom } from '@fortawesome/fontawesome-svg-core'
import { faPlus, faCog, faTimes, faPen, faTrash, faCaretUp, faCaretDown,
	faEllipsisH, faCircle } from '@fortawesome/free-solid-svg-icons'

library.add(faPlus, faCog, faTimes, faPen, faTrash, faCaretUp, faCaretDown,
	faEllipsisH, faCircle);
dom.watch();
