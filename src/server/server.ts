import express from "express";
import fs from "fs";


// Settings

const PORT = process.env.PORT ?? 8000;
export const serverConfig = (function() {
	if (!fs.existsSync("config_server.json")) {
		return {};
	}
	return JSON.parse(fs.readFileSync("config_server.json").toString());
})();

export const IS_DEBUG = process.env.NODE_ENV !== "production";
export const OWNER_EMAIL = process.env.OWNER_EMAIL ?? serverConfig.OWNER_EMAIL;
export const UA_DEFAULT = "Mozilla/5.0 (compatible; Homescreen App/0.1; +https://rubenwardy.com/homescreen/bot.html)";
export const UA_PROXY = "Mozilla/5.0 (compatible; Homescreen Proxy/0.1; +https://rubenwardy.com/homescreen/bot.html)";


// App

import { getWeatherInfo } from "./weather";
import { getBackground } from "./backgrounds";
import { handleProxy } from "./proxy";
import { getCoordsFromQuery } from "./geocode";

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
	try {
		const result = await handleProxy(url);
		res.status(result.status).type(result.contentType).send(result.text);
	} catch (ex) {
		res.status(400).send(ex.message);
	}
});


app.get("/api/weather/", async (req: express.Request, res: express.Response) => {
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


app.get("/api/geocode/", async (req: express.Request, res: express.Response) => {
	if (!req.query.q) {
		res.status(400).send("Missing query");
		return;
	}

	try {
		res.json(await getCoordsFromQuery((req.query.q as string).trim()));
	} catch (ex) {
		res.status(400).send(ex.message);
	}
});


app.get("/api/background/", async (_req: express.Request, res: express.Response) => {
	try {
		res.json(await getBackground());
	} catch (ex) {
		res.status(400).send(ex.message);
	}
});


app.listen(PORT, () => {
	console.log(`⚡️[server]: Server is running in ${IS_DEBUG ? "debug" : "prod"} at http://localhost:${PORT}`);
});
