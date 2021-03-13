interface Config {
	API_URL: string;
	PROXY_URL: string;
	PROXY_ALLOWED_HOSTS: string[];
}

export const config: Config = require("../../config_client.json");

import React from "react";
import { render } from "react-dom";
import App from "./components/App";
import "./scss/main.scss";

require("@fortawesome/fontawesome-free/css/all.min.css");


render(
  <App />,
  document.getElementById("app")
);

window.onload = () => {
	if (typeof browser === "undefined") {
		document.title = "Homescreen Web";
	}
};
