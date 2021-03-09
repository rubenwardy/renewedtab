import express from "express";
import fetch, { Request } from "node-fetch";
import fs from "fs";
import { getWeatherInfo } from "./weather";
import { getBackground } from "./backgrounds";


// Settings

const PORT = process.env.PORT ?? 8000;
const config = JSON.parse(fs.readFileSync("config.json").toString());

const keys = (function() {
	if (!process.env.HOME) {
		return {};
	}

	const path = process.env.HOME + "/.homescreen_keys.json";
	if (fs.existsSync(path)) {
		return JSON.parse(fs.readFileSync(path).toString());
	} else {
		return {};
	}
})();

const PROXY_ALLOWED_HOSTS = new Set(config.PROXY_ALLOWED_HOSTS);
export const IS_DEBUG = process.env.NODE_ENV !== "production";
export const OPEN_WEATHER_MAP_API_KEY =
	process.env.OPEN_WEATHER_MAP_API_KEY ?? keys.OPEN_WEATHER_MAP_API_KEY;
export const PIXABAY_API_KEY =
	process.env.PIXABAY_API_KEY ?? keys.PIXABAY_API_KEY;


// App

const app = express();
app.use((_req, res, next) => {
	const expiresAt = new Date(new Date().getTime() + 4*60*60*1000);

	res.append("Access-Control-Allow-Origin", ["*"]);
	res.append("Access-Control-Allow-Methods", "GET");
	res.append("Access-Control-Allow-Headers", "Content-Type");
	res.append("expires", expiresAt.toISOString());
	next();
});


app.get("/proxy/", async (req: express.Request, res: express.Response) => {
	if (!req.query.url) {
		res.status(400).send("Missing URL");
		return;
	}

	const url = new URL(req.query.url as string);
	if (!PROXY_ALLOWED_HOSTS.has(url.host)) {
		const msg = `Accessing host ${url.host} is not allowed on the web version. ` +
			`Consider using the Chrome/Firefox extension to be able to access any domain.`
		res.status(403).send(msg);
		return;
	}

	try {
		const response = await fetch(new Request(url, {
			method: "GET",
			headers: {
				"Accept": "application/json",
			}
		}));

		res.type(response.headers.get("Content-Type") ?? "text/plain")
			.send(await response.text());
	} catch (ex) {
		res.status(404).send(ex.message);
	}
});


app.get("/weather/", async (req: express.Request, res: express.Response) => {
	if (!req.query.long || !req.query.lat) {
		res.status(400).send("Missing location");
		return;
	}

	try {
		res.json(await getWeatherInfo(
			Number.parseFloat(req.query.lat as string),
			Number.parseFloat(req.query.long as string)));
	} catch (ex) {
		res.status(400).send(ex.message);
	}
});


app.get("/background/", async (_req: express.Request, res: express.Response) => {
	try {
		res.json(await getBackground());
	} catch (ex) {
		res.status(400).send(ex.message);
	}
});


app.listen(PORT, () => {
	console.log(`⚡️[server]: Server is running in ${IS_DEBUG ? "debug" : "prod"} at http://localhost:${PORT}`);
});
