import express from "express";
import fs from "fs";
import path from "path";
import fetchCatch, { Request } from "./http";
import * as Sentry from "@sentry/node";
import * as Tracing from "@sentry/tracing";


// Settings

const PORT = process.env.PORT ?? 8000;
export const serverConfig = (function() {
	if (!fs.existsSync("config.json")) {
		return {};
	}
	return JSON.parse(fs.readFileSync("config.json").toString());
})();

export const IS_DEBUG = process.env.NODE_ENV !== "production";
const DISCORD_WEBHOOK = process.env.DISCORD_WEBHOOK ?? serverConfig.DISCORD_WEBHOOK;
export const UA_DEFAULT = "Mozilla/5.0 (compatible; Renewed Tab App/1.15.4; +https://renewedtab.com/)";
export const UA_PROXY = "Mozilla/5.0 (compatible; Renewed Tab Proxy/1.15.4; +https://renewedtab.com/)";
const SENTRY_DSN = process.env.SENTRY_DSN;
const SAVE_ROOT = process.env.SAVE_ROOT ?? serverConfig.SAVE_ROOT ?? ".";
export const ACCUWEATHER_API_KEY =
	process.env.ACCUWEATHER_API_KEY ?? serverConfig.ACCUWEATHER_API_KEY;




// App

import { getWeatherInfoByCoords } from "./weather";
import { getBackground } from "./backgrounds";
import { handleProxy } from "./proxy";
import { getCoordsFromQuery, getLocationFromCoords } from "./weather/geocode";
import getImageFromUnsplash from "./backgrounds/unsplash";
import SpaceLaunch from "common/api/SpaceLaunch";
import { getQuote, getQuoteCategories } from "./quotes";
import { getCurrencies } from "./currencies";

const app = express();

Sentry.init({
	enabled: SENTRY_DSN != undefined,
	dsn: SENTRY_DSN,
	integrations: [
		new Sentry.Integrations.Http({ tracing: true }),
		new Tracing.Integrations.Express({ app }),
	],

	beforeSend(event) {
		// Drop expected UserError exceptions
		// if ((event.exception?.values ?? []).some(x => x.type == "UserError")) {
		// 	return null;
		// }

		return event;
	}
});

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((_req, res, next) => {
	const expiresAt = new Date(new Date().getTime() + 15*60*1000);

	res.append("Access-Control-Allow-Origin", ["*"]);
	res.append("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
	res.append("Access-Control-Allow-Headers", "Content-Type");
	res.append("expires", expiresAt.toISOString());
	next();
});


function writeClientError(res: express.Response, msg: string) {
	res.status(400).type("text").send(msg);
}


import { promRegister, notifyAPIRequest, notifyUpstreamRequest } from "./metrics";
import { TippyTopImage } from "common/api/icons";
import UserError from "./UserError";

app.get('/metrics', async (req, res) => {
	try {
		const metrics = await promRegister.metrics();
		res.set('Content-Type', promRegister.contentType);
		res.send(metrics);
	} catch (ex: any) {
		res.statusCode = 500;
		res.send(ex.message);
	}
});


app.get("/proxy/", async (req: express.Request, res: express.Response) => {
	if (!req.query.url) {
		writeClientError(res, "Missing URL");
		return;
	}

	notifyAPIRequest("proxy");

	const url = new URL(req.query.url as string);
	const result = await handleProxy(url);
	res.status(result.status).type(result.contentType).send(result.text);
});


function parseLocation(req: express.Request) {
	if (typeof req.query.long != "string" || typeof req.query.lat != "string") {
		return null;
	}

	const location = {
		latitude: parseFloat(req.query.lat as string),
		longitude: parseFloat(req.query.long as string),
	};

	if (isNaN(location.latitude) || isNaN(location.longitude)) {
		return null;
	}

	return location;
}


app.get("/api/weather/", async (req: express.Request, res: express.Response) => {
	const location = parseLocation(req);
	if (!location) {
		writeClientError(res, "Missing location");
		return;
	}

	notifyAPIRequest("weather");

	res.json(await getWeatherInfoByCoords(location.latitude, location.longitude));
});


app.get("/api/geocode/", async (req: express.Request, res: express.Response) => {
	if (!req.query.q) {
		writeClientError(res, "Missing query");
		return;
	}

	notifyAPIRequest("geocode");

	res.json(await getCoordsFromQuery((req.query.q as string).trim()));
});


app.get("/api/geolookup/", async (req: express.Request, res: express.Response) => {
	const location = parseLocation(req);
	if (!location) {
		writeClientError(res, "Missing location");
		return;
	}

	notifyAPIRequest("geolookup");

	res.json(await getLocationFromCoords(location.latitude, location.longitude));
});


app.get("/api/background/", async (_req: express.Request, res: express.Response) => {
	notifyAPIRequest("background");

	res.json(await getBackground());
});


const backgroundVoteStream = fs.createWriteStream(
	path.resolve(SAVE_ROOT, "votes.csv"), { flags: "a" });
app.post("/api/background/vote/", async (req: express.Request, res: express.Response) => {
	notifyAPIRequest("vote");

	const background = req.body.background;
	const isPositive = req.body.is_positive;
	if (background?.id == undefined || isPositive === undefined) {
		writeClientError(res, "Missing background.id or is_positive");
		return;
	}

	const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
	const url = background.url ?? "";
	const line =
		`${ip}, ${background.id}, ${isPositive ? 'good' : 'bad'}, ${url}\n`;
	backgroundVoteStream.write(line);

	res.json({ success: true });
});


const reCollectionID = /[\/\? ]/;
app.get("/api/unsplash/", async (req: express.Request, res: express.Response) => {
	notifyAPIRequest("unsplash");

	const collection = req.query.collection as (string | undefined);
	if (!collection) {
		writeClientError(res, "Missing collection ID");
		return;
	}

	if (reCollectionID.test(collection)) {
		writeClientError(res, "Invalid collection ID");
		return;
	}

	res.json(await getImageFromUnsplash(collection));
});


app.get("/api/space-flights/", async (_req: express.Request, res: express.Response) => {
	notifyAPIRequest("spaceflights");
	notifyUpstreamRequest("RocketLaunch.live");

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

	function mapProvider(provider: string): string {
		if (provider.toLowerCase() == "united launch alliance (ula)") {
			return "United Launch Alliance";
		} else {
			return provider;
		}
	}

	const launches: SpaceLaunch[] = result.map((launch: any) => ({
		id: launch.id,
		name: launch.name,
		provider: mapProvider(launch.provider?.name),
		vehicle: launch.vehicle?.name,
		win_open: launch.win_open,
		win_close: launch.win_close,
		date_str: launch.date_str,
		link: `https://rocketlaunch.live/launch/${launch.slug}`,
	}));

	res.json(launches);
});

const feedbackStream = fs.createWriteStream(
	path.resolve(SAVE_ROOT, "feedback.txt"), { flags: "a" });
app.post("/api/feedback/", async (req: express.Request, res: express.Response) => {
	notifyAPIRequest("feedback");

	if (!req.body.event) {
		writeClientError(res, "Missing event");
		return;
	}

	feedbackStream.write(JSON.stringify(req.body) + "\n\n");

	if (DISCORD_WEBHOOK) {
		let comments = req.body.comments;

		const extraIds = [ "missing_features", "difficult", "buggy" ];
		for (const id of extraIds) {
			const value = req.body[`extra-${id}`];
			if (value && value != "") {
				comments += `\n\n${id}:\n${value}`;
			}
		}

		const reasons = (typeof req.body.reason === "string") ? [ req.body.reason ] : req.body.reason;
		let content = `
			**Feedback**
			Event: ${req.body.event}
			Info: ${req.body.version ? "v" + req.body.version : ""} / ${req.body.browser} / ${req.body.platform}
			${reasons ? `Reasons: ${reasons.join(", ")}
					${req.body.other_reason}` : ""}
			${req.body.email ? `Email: ${req.body.email}` : ""}

			${comments}
		`;

		// Only allow at most two new lines in a row, ignoring whitespace
		content = content.replace(/\n\s*\n/g, "\n\n");

		notifyUpstreamRequest("Discord.com");

		await fetchCatch(new Request(DISCORD_WEBHOOK, {
			method: "POST",
			timeout: 10000,
			headers: {
				"User-Agent": UA_DEFAULT,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				content: content.replace(/\t/g, "").substr(0, 2000)
			}),
		}));
	}

	if (req.query.r) {
		res.redirect("https://renewedtab.com/feedback/thanks/");
	} else {
		res.json({ success: true });
	}
});


function readAutocompleteFromFile(filename: string) {
	return fs.readFileSync(`src/server/data/${filename}.csv`)
		.toString()
		.split(/\r?\n/)
		.map(x => x.split(","))
		.filter(x => x.length == 2)
		.map(([label, value]) => ({ label: label.trim(), value: value.trim() }))
		.sort((a, b) => a.label.localeCompare(b.label, undefined, { sensitivity: "base" }));
}


const feeds = readAutocompleteFromFile("feeds");
const webcomics = readAutocompleteFromFile("webcomics");
const feeds_background = readAutocompleteFromFile("feeds_background");
app.get("/api/feeds/", async (_req: express.Request, res: express.Response) => {
	notifyAPIRequest("autocomplete:feeds");
	res.json(feeds);
});
app.get("/api/webcomics/", async (_req: express.Request, res: express.Response) => {
	notifyAPIRequest("autocomplete:webcomic");
	res.json(webcomics);
});
app.get("/api/feeds/background/", async (_req: express.Request, res: express.Response) => {
	notifyAPIRequest("autocomplete:feeds_background");
	res.json(feeds_background);
});

app.post("/api/autocomplete/", async (req: express.Request, res: express.Response) => {
	notifyAPIRequest("autocomplete:suggest");

	if (!req.body.url) {
		writeClientError(res, "Missing URL");
		return;
	}
	if (!DISCORD_WEBHOOK) {
		writeClientError(res, "Server doesn't have suggestions enabled, missing DISCORD_WEBHOOK");
		return;
	}

	const content = `
		**URL Suggestion**
		Url: ${req.body.url}
	`;

	notifyUpstreamRequest("Discord.com");

	await fetchCatch(new Request(DISCORD_WEBHOOK, {
		method: "POST",
		timeout: 10000,
		headers: {
			"User-Agent": UA_DEFAULT,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			content: content.replace(/\t/g, "").substr(0, 2000)
		}),
	}));

	res.json({ success: true });
});


app.get("/api/quote-categories/", async (req: express.Request, res: express.Response) => {
	notifyAPIRequest("quote-categories");

	const quoteCategories = await getQuoteCategories();
	res.json(quoteCategories);
});


app.get("/api/quotes/", async (req: express.Request, res: express.Response) => {
	notifyAPIRequest("quotes");

	let categories: (string[] | undefined);

	const queryArg = req.query.categories;
	if (queryArg instanceof Array) {
		categories = queryArg as string[];
	} else if (typeof queryArg == "string") {
		categories = [ queryArg as string ];
	} else {
		categories = [ "inspire", "life", "love", "funny" ];
	}

	const category = categories[Math.floor(Math.random() * categories.length)];
	const quote = await getQuote(category);
	res.json({ ...quote, category: category });
});

app.get("/api/currencies/", async (req: express.Request, res: express.Response) => {
	notifyAPIRequest("currency");
	res.json(await getCurrencies());
});


const TIPPY_TOP_URL = "https://mozilla.github.io/tippy-top-sites/data/icons-top2000.json";
let icons: (TippyTopImage[] | undefined) = undefined;
app.get("/api/website-icons/", async (req, res: express.Response) => {
	if (!icons) {
		const response = await fetchCatch(new Request(TIPPY_TOP_URL), {
			method: "GET",
			timeout: 10000,
			headers: {
				"User-Agent": UA_DEFAULT,
				"Accept": "application/json",
			},
		});
		icons = (await response.json()) as TippyTopImage[];
		icons.push({
			domains: [ "minetest.net", "wiki.minetest.net", "forum.minetest.net" ],
			image_url: "https://www.minetest.net/media/icon.svg",
		}, {
			domains: [ "feeds.bbci.co.uk" ],
			image_url: "https://m.files.bbci.co.uk/modules/bbc-morph-news-waf-page-meta/5.2.0/apple-touch-icon.png",
		});
	}
	res.json(icons);
});

app.use(Sentry.Handlers.errorHandler());

app.use(function (err: any, _req: any, res: any, next: any) {
	console.error(err.stack);
	if (err instanceof UserError) {
		writeClientError(res, err.message);
	} else {
		res.status(400).type("text").send("Unexpected error");
	}
	next();
});

app.listen(PORT, () => {
	console.log(`⚡️[server]: Server is running in ${IS_DEBUG ? "debug" : "prod"} at http://localhost:${PORT}`);
});
