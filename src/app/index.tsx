interface Config {
	API_URL: string;
	PROXY_URL: string;
	PROXY_ALLOWED_HOSTS: string[];
}

export const config: Config = require("../../config_client.json");


declare global {
	interface Window {
		browser: any | undefined;
		permission: any | undefined;
	}
}


import React from 'react';
import { render } from 'react-dom';
import App from './components/App';
import "./scss/main.scss";

require("@fortawesome/fontawesome-free/css/all.min.css");


render(
  <App />,
  document.getElementById("app")
);
