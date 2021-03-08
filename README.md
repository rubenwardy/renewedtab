# Homescreen

A clean web browser "New Tab" / "Home page" page, created using TypeScript and React.

License: GPLv3 or later.

## Usage

### Create client config

Copy `config.example.json` to `config.json`, and change URLs:

```js
{
	"API_URL": "http://localhost:8000/",
	"PROXY_URL": "http://localhost:8000/proxy/",

	/* other settings here */
}
```

Possible values:

* `API_URL`: Base URL for the API. May contain a path.
* `PROXY_URL`: URL to the proxy, for the web version.
* `PROXY_ALLOWED_HOSTS`: Array of hostnames that the proxy is allowed to GET from.

You can also set a server setting here (for now, because I'm lazy):

* `OPEN_WEATHER_MAP_API_KEY`:
  API Key for [openweathermap.org](https://home.openweathermap.org/users/sign_up).

  **Warning: will leak API key if used in production**.

### Debug: Web

```bash
npm install
npm start
# ^ this will open your web browser
```

### Debug: Firefox extension

```bash
npm install
npm start:firefox
# ^ this will open a Firefox window for testing the extension
```

### Production

See .gitlab-ci.yml. Sorry.

### More documentation

See the [docs](docs) folder.
