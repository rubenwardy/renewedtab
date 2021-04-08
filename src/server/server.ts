import express from "express";
import fs from "fs";
import fetchCatch, { Request } from "./http";


// Settings

const PORT = process.env.PORT ?? 8000;
export const serverConfig = (function() {
	if (!fs.existsSync("config.json")) {
		return {};
	}
	return JSON.parse(fs.readFileSync("config.json").toString());
})();

export const IS_DEBUG = process.env.NODE_ENV !== "production";
export const OWNER_EMAIL = process.env.OWNER_EMAIL ?? serverConfig.OWNER_EMAIL;
export const UA_DEFAULT = "Mozilla/5.0 (compatible; Renewed Tab App/1.0.1; +https://renewedtab.rubenwardy.com/)";
export const UA_PROXY = "Mozilla/5.0 (compatible; Renewed Tab Proxy/1.0.1; +https://renewedtab.rubenwardy.com/)";


// App

import { getWeatherInfo } from "./weather";
import { getBackground } from "./backgrounds";
import { handleProxy } from "./proxy";
import { getCoordsFromQuery } from "./geocode";
import getImageFromUnsplash from "./backgrounds/unsplash";

const app = express();

app.use(express.json());

app.use((_req, res, next) => {
	const expiresAt = new Date(new Date().getTime() + 15*60*1000);

	res.append("Access-Control-Allow-Origin", ["*"]);
	res.append("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
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


const backgroundVoteStream = fs.createWriteStream("votes.csv", { flags: "a" });
app.post("/api/background/vote/", async (req: express.Request, res: express.Response) => {
	try {
		const background = req.body.background;
		const isPositive = req.body.is_positive;
		if (background?.id == undefined || isPositive === undefined) {
			res.status(400).send("Missing background.id or is_positive");
			return;
		}

		const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
		const url = background.url ?? "";
		const line =
			`${ip}, ${background.id}, ${isPositive ? 'good' : 'bad'}, ${url}\n`;
		backgroundVoteStream.write(line);

		res.json({ success: true });
	} catch (ex) {
		res.status(400).send(ex.message);
	}
});


const reCollectionID = /^[0-9]+$/;
app.get("/api/unsplash/", async (req: express.Request, res: express.Response) => {
	try {
		const collection = req.query.collection as (string | undefined);
		if (!collection) {
			res.status(400).send("Missing collection ID");
			return;
		}

		if (!reCollectionID.test(collection)) {
			res.status(400).send("Invalid collection ID");
			return;
		}

		res.json(await getImageFromUnsplash(collection));
	} catch (ex) {
		res.status(400).send(ex.message);
	}
});


app.get("/api/space-flights/", async (_req: express.Request, res: express.Response) => {
	try {
		const ret = await fetchCatch(new Request("https://fdo.rocketlaunch.live/json/launches/next/5", {
			method: "GET",
			size: 0.1 * 1000 * 1000,
			timeout: 10000,
			headers: {
				"User-Agent": UA_DEFAULT,
				"Accept": "application/json",
			},
		}));

		const json = await ret.json();

		// Stupid API keeps changing
		const result = json.response?.result ?? json.result;

		const launches = result.map((launch: any) => ({
			id: launch.id,
			name: launch.name,
			provider: launch.provider?.name,
			vehicle: launch.vehicle?.name,
			win_open: launch.win_open,
			win_close: launch.win_close,
			date_str: launch.date_str,
			link: `https://rocketlaunch.live/launch/${launch.slug}`,
		}));

		res.json(launches);
	} catch (ex) {
		res.status(400).send(ex.message);
	}
});


app.listen(PORT, () => {
	console.log(`⚡️[server]: Server is running in ${IS_DEBUG ? "debug" : "prod"} at http://localhost:${PORT}`);
});
