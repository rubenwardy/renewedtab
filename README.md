# Homescreen

A clean web browser "New Tab" / "Home page" page, created using TypeScript and React.

License: GPLv3 or later.

## Usage

### Client Config

Copy `config_client.example.json` to `config_client.json`.
Replace the URLs in the `config_client.json`:

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

### Server config

Copy `config_server.example.json` to `config_server.json`.

If you change "API_URL", then you'll need to set up API tokens to get
certain features to work. You can do this using `config_server.json` or using environment variables.

Create `config.server.json` and put your
[openweathermap.org](https://home.openweathermap.org/users/sign_up)
and [pixabay.com](https://pixabay.com/api/docs/) API tokens inside:

```json
{
	"OPEN_WEATHER_MAP_API_KEY": "123",
	"PIXABAY_API_KEY": "123",
	"UPLOADS_DIR": "/tmp/homescreen"
}
```

Possible values:

* `OPEN_WEATHER_MAP_API_KEY`: API key for [openweathermap.org](https://home.openweathermap.org/users/sign_up).
* `PIXABAY_API_KEY`: API key for [pixabay.com](https://pixabay.com/api/docs/).
* `UPLOADS_DIR`: URL to the proxy, for the web version.
* `PROXY_ALLOWED_HOSTS`: Array of hostnames that the proxy is allowed to GET from.

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
