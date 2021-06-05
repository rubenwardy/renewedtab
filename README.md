# Renewed Tab

[![pipeline status](https://gitlab.com/rubenwardy/renewedtab/badges/master/pipeline.svg)](https://gitlab.com/rubenwardy/renewedtab/-/commits/master) [![website](https://img.shields.io/badge/Try_It-Online-blue)](https://renewedtab.com/web/)

A clean web browser "New Tab" / "Home page" page, created using TypeScript and React.

License: GPLv3 or later.

## Usage

### Introduction

Renewed Tab has 3 components:

* A web **app**, found at `src/app`. This is written using React, and
  uses some browser extension APIs when available.
* An API/proxy **server**, found at `src/server`.
  This provides various APIs, and allows requests to be proxied to get
  around CORS. You can also use the production server if you're not changing
  any APIs.
* A **webext**, found at `src/webext`. This contains the manifest.json,
  and will wrap the web app when compiled.

### Configure

Copy `config.example.json` to `config.json`.

(Optional) If you want to run a local API/proxy server, then you will need to:

* Change `API_URL` and `PROXY_URL` in `config.json` to localhost:


	```js
	{
		"API_URL": "http://localhost:8000/api/",
		"PROXY_URL": "http://localhost:8000/proxy/",

		/* other settings here */
	}
	```

* Configure some API keys if you want to use third-party services.
  These are optional, but will prevent some features from working.
	* The settings:
		* `OPEN_WEATHER_MAP_API_KEY`: [openweathermap.org](https://home.openweathermap.org/users/sign_up)
		* `UNSPLASH_ACCESS_KEY`: [Unsplash](https://unsplash.com/oauth/applications)
		* `OWNER_EMAIL`: Your email, required by OpenStreetMap
	* You can set the above server settings in `config.json`, or using
	  environment variables (recommended for production).

* You can also change other server settings in `config.json`:
	* `PROXY_ALLOWED_HOSTS`: Array of allowed host names.

### Debug

Make sure to run `npm install`.

* Web + server: `npm start`
* Web only: `npm run start:app`
* Web extension
	* Firefox: `npm run start:firefox`
	* Chrome: `npm run start:chrome`

### Production

Make sure to run `npm install`, and to set the `NODE_ENV` environment
variable to `production`.

* Web + server: `npm run build`
* Web only: `npm run build:app`
* Web extension: `npm run package:webext`

Also see .gitlab-ci.yml.

### More documentation

See the [docs](docs) folder.
