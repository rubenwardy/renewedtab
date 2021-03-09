# Homescreen

A clean web browser "New Tab" / "Home page" page, created using TypeScript and React.

License: GPLv3 or later.

## Usage

### Configure

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

If you change "API_URL", then you'll need to set up API tokens to get
certain features to work. You can do this using a `.json` file in your home
directory, or using environment variables.

Create `~/.homescreen_keys.json` and put your
[openweathermap.org](https://home.openweathermap.org/users/sign_up)
and [pixabay.com](https://pixabay.com/api/docs/) API tokens inside:

```json
{
	"OPEN_WEATHER_MAP_API_KEY": "123",
	"PIXABAY_API_KEY": "123"
}
```

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
