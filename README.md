# Homescreen

[![pipeline status](https://gitlab.com/rubenwardy/homescreen/badges/master/pipeline.svg)](https://gitlab.com/rubenwardy/homescreen/-/commits/master) [![website](https://img.shields.io/badge/Try_It-Online-blue)](https://homescreen.rubenwardy.com/)

A clean web browser "New Tab" / "Home page" page, created using TypeScript and React.

License: GPLv3 or later.

## Usage

### Client Config

Copy `config_client.example.json` to `config_client.json`.
Replace the URLs in the `config_client.json`:

```js
{
	"API_URL": "http://localhost:8000/api/",
	"PROXY_URL": "http://localhost:8000/proxy/",

	/* other settings here */
}
```

Possible values:

* `API_URL`: Base URL for the API. May contain a path.
* `PROXY_URL`: URL to the proxy, for the web version.

### Server config

You'll need to configure some API keys for the server in order to use certain
features. These are optional, but will prevent some features from working.

* `OPEN_WEATHER_MAP_API_KEY`: [openweathermap.org](https://home.openweathermap.org/users/sign_up)
* `PIXABAY_API_KEY`: [pixabay.com](https://pixabay.com/api/docs/)
* `UNSPLASH_ACCESS_KEY`: [Unsplash](https://unsplash.com/oauth/applications)
* `OWNER_EMAIL`: Your email, required by OpenStreetMap
* `PROXY_ALLOWED_HOSTS`:
	Array of hostnames that the proxy is allowed to GET from.

You can do this either by copying `config_server.example.json` to
`config_server.json` and editing it, or by using environment variables
(recommended for production).

### Debug

Make sure to run `npm install`.

* Web: `npm start`
* Firefox: `npm run start:firefox`

### Production

Make sure to run `npm install`, and to set the `NODE_ENV` environment
variable to `production`.

* Web + server: `npm run build`
* Web only: `npm run build:app`
* Firefox: `npm run package:firefox`

Also see .gitlab-ci.yml.

### More documentation

See the [docs](docs) folder.
