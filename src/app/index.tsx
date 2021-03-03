export const config = require("../../config.json");

import React from 'react';
import { render } from 'react-dom';
import App from './components/App';
import "./scss/main.scss";


render(
  <App />,
  document.getElementById("app")
);
