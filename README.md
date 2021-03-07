# Homescreen

A clean web browser "New Tab" / "Home page" page, created using TypeScript and React.

License: MIT

## Usage

### Create Config

Copy `config.example.json` to `config.json`, and change URLs:

```js
{
	"PROXY_URL": "http://localhost:8000/proxy/",

	/* other settings here *//
}
```

### Production


```bash
npm install --prod
npm run build
# -> output is in dist/
```

### Debug

```bash
npm install
npm start
# ^ this will open your web browser
```
