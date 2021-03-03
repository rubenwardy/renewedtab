# Homescreen

A clean web browser "New Tab" / "Home page" page, created using TypeScript and React.

License: MIT

## Usage

### Create Config

Create `config.json` file in the root of this project, with the following content:

```json
{
	"PROXY_URL": "http://localhost:8000"
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
