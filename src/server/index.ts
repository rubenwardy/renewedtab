import express from "express";
import fs from "fs";
import path from "path";
import Sentry from "@sentry/node";

import { SENTRY_DSN, SAVE_ROOT, UA_DEFAULT, DISCORD_WEBHOOK, UA_PROXY, PORT, IS_DEBUG } from "./config";


// App

const app = express();

Sentry.init({
	enabled: SENTRY_DSN != undefined,
	dsn: SENTRY_DSN,

	beforeSend(event) {
		// Drop expected UserError exceptions
		if ((event.exception?.values ?? []).some(x => x.type == "UserError")) {
			return null;
		}

		return event;
	}
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((_req, res, next) => {
	res.append("Access-Control-Allow-Origin", ["*"]);
	res.append("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
	res.append("Access-Control-Allow-Headers", "Content-Type");
	next();
});


function writeClientError(res: express.Response, msg: string) {
	res.status(400).type("text").send(msg);
}

import fetchCatch, {Request} from "./http";
import { promRegister, notifyAPIRequest, notifyUpstreamRequest } from "./metrics";
import { TippyTopImage } from "common/api/icons";
import UserError from "./UserError";
import { FeedType } from "common/feeds";
import { detectFeed } from "common/feeds/detect";
import { JSDOM } from "jsdom";
import { handleProxy } from "./proxy";
import { getWeatherInfoByCoords } from "./weather";
import { getBackground } from "./backgrounds";
import { getCoordsFromQuery, getLocationFromCoords } from "./weather/geocode";
import getImageFromUnsplash from "./backgrounds/unsplash";
import SpaceLaunch from "common/api/SpaceLaunch";
import { getQuote, getQuoteCategories } from "./quotes";
import { getCurrencies } from "./currencies";
import { autocompleteFeeds, autocompleteWebcomics, autocompleteBackgroundFeeds } from "./data";


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


app.get("/proxy/", async (req: express.Request, res: express.Response, next: (e: unknown) => void) => {
	try {
		if (!req.query.url) {
			writeClientError(res, "Missing URL");
			return;
		}

		notifyAPIRequest("proxy");

		const url = new URL(req.query.url as string);
		const result = await handleProxy(url);
		res.status(result.status)
			.setHeader("Cache-Control", "max-age=300")
			.type(result.contentType).send(result.text);
	} catch (e: any) {
		next(e);
	}
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


app.get("/api/weather/", async (req: express.Request, res: express.Response, next: (e: unknown) => void) => {
	try {
		const location = parseLocation(req);
		if (!location) {
			writeClientError(res, "Missing location");
			return;
		}

		notifyAPIRequest("weather");

		res
			.setHeader("Cache-Control", "max-age=7200")
			.json(await getWeatherInfoByCoords(location.latitude, location.longitude));
	} catch (e: any) {
		next(e);
	}
});


app.get("/api/geocode/", async (req: express.Request, res: express.Response, next: (e: unknown) => void) => {
	try {
		if (!req.query.q) {
			writeClientError(res, "Missing query");
			return;
		}

		notifyAPIRequest("geocode");

		res
			.setHeader("Cache-Control", "max-age=604800")
			.json(await getCoordsFromQuery((req.query.q as string).trim()));
	} catch (e: any) {
		next(e);
	}
});


app.get("/api/geolookup/", async (req: express.Request, res: express.Response, next: (e: unknown) => void) => {
	try {
		const location = parseLocation(req);
		if (!location) {
			writeClientError(res, "Missing location");
			return;
		}

		notifyAPIRequest("geolookup");

		res
			.setHeader("Cache-Control", "max-age=604800")
			.json(await getLocationFromCoords(location.latitude, location.longitude));
	} catch (e: any) {
		next(e);
	}
});


app.get("/api/background/", async (_req: express.Request, res: express.Response, next: (e: unknown) => void) => {
	try {
		notifyAPIRequest("background");

		res
			.setHeader("Cache-Control", "max-age=300")
			.json(await getBackground());
	} catch (e: any) {
		next(e);
	}
});


const backgroundVoteStream = fs.createWriteStream(
	path.resolve(SAVE_ROOT, "votes.csv"), { flags: "a" });

app.post("/api/background/vote/", async (req: express.Request, res: express.Response, next: (e: unknown) => void) => {
	try {
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
	} catch (e: any) {
		next(e);
	}
});


const reCollectionID = /[\/\? ]/;
app.get("/api/unsplash/", async (req: express.Request, res: express.Response, next: (e: unknown) => void) => {
	try {
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

		res
			.setHeader("Cache-Control", "max-age=300")
			.json(await getImageFromUnsplash(collection));
	} catch (e: any) {
		next(e);
	}
});


app.get("/api/space-flights/", async (_req: express.Request, res: express.Response, next: (e: unknown) => void) => {
	try {
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

		res.setHeader("Cache-Control", "max-age=3600").json(launches);
	} catch (e: any) {
		next(e);
	}
});

const feedbackStream = fs.createWriteStream(
	path.resolve(SAVE_ROOT, "feedback.txt"), { flags: "a" });

app.post("/api/feedback/", async (req: express.Request, res: express.Response, next: (e: unknown) => void) => {
	try {
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
	} catch (e: any) {
		next(e);
	}
});


app.get("/api/feeds/", async (_req: express.Request, res: express.Response, next: (e: unknown) => void) => {
	try {
		notifyAPIRequest("autocomplete:feeds");
		res.setHeader("Cache-Control", "max-age=25200").json(autocompleteFeeds);
	} catch (e: any) {
		next(e);
	}
});

app.get("/api/webcomics/", async (_req: express.Request, res: express.Response, next: (e: unknown) => void) => {
	try {
		notifyAPIRequest("autocomplete:webcomic");
		res.setHeader("Cache-Control", "max-age=25200").json(autocompleteWebcomics);
	} catch (e: any) {
		next(e);
	}
});

app.get("/api/feeds/background/", async (_req: express.Request, res: express.Response, next: (e: unknown) => void) => {
	try {
		notifyAPIRequest("autocomplete:feeds_background");
		res.setHeader("Cache-Control", "max-age=25200").json(autocompleteBackgroundFeeds);
	} catch (e: any) {
		next(e);
	}
});

app.post("/api/autocomplete/", async (req: express.Request, res: express.Response, next: (e: unknown) => void) => {
	try {
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
	} catch (e: any) {
		next(e);
	}
});


app.get("/api/quote-categories/", async (req: express.Request, res: express.Response, next: (e: unknown) => void) => {
	try {
		notifyAPIRequest("quote-categories");

		const quoteCategories = await getQuoteCategories();
		res.setHeader("Cache-Control", "max-age=3600").json(quoteCategories);
	} catch (e: any) {
		next(e);
	}
});


app.get("/api/quotes/", async (req: express.Request, res: express.Response) => {
	try {
		notifyAPIRequest("quotes");

		let categories: (string[] | undefined);

		const queryArg = req.query.categories;
		if (queryArg instanceof Array) {
			categories = queryArg as string[];
		} else if (typeof queryArg == "string") {
			categories = [ queryArg as string ];
		} else {
			categories = [ "inspire" ];
		}

		const quoteCategories = await getQuoteCategories();
		// filter out unknown categories
		categories = categories.filter(x => quoteCategories.find(y => y.id == x));
		if (categories.length == 0) {
			categories.push("inspire");
		}

		const category = categories[Math.floor(Math.random() * categories.length)];
		const quotes = await getQuote(category);
		quotes.forEach(quote => {
			(quote as any).category = category;
		});
		if (quotes.length == 0) {
			res.removeHeader("expires");
			res.append("max-age", "0");
		}
		res.setHeader("Cache-Control", "max-age=300").json(quotes);
	} catch (e: any) {
		// next(e);
		res.removeHeader("expires");
		res.append("max-age", "0");
		res.json([]);
	}
});


app.get("/api/currencies/", async (req: express.Request, res: express.Response, next: (e: unknown) => void) => {
	try {
		notifyAPIRequest("currency");
		res.setHeader("Cache-Control", "max-age=10800").json(await getCurrencies());
	} catch (e: any) {
		next(e);
	}
});


const TIPPY_TOP_URL = "https://mozilla.github.io/tippy-top-sites/data/icons-top2000.json";
let icons: (TippyTopImage[] | undefined) = undefined;

app.get("/api/website-icons/", async (req, res: express.Response, next: (e: unknown) => void) => {
	try {
		if (!icons) {
			notifyUpstreamRequest(new URL(TIPPY_TOP_URL).hostname);
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

			icons.find(x => x.domains.includes("github.com"))!.image_url =
				"https://github.githubassets.com/favicons/favicon-dark.svg";
		}
		res.setHeader("Cache-Control", "max-age=25200").json(icons);
	} catch (e: any) {
		next(e);
	}
});


app.get("/api/detect-feed/", async (req: express.Request, res: express.Response, next: (e: unknown) => void) => {
	try {
		if (typeof req.query.url != "string") {
			writeClientError(res, "Missing URL");
			return;
		}

		notifyAPIRequest("detect-feed");

		const feeds = await detectFeed(req.query.url as string, async (url) => {
			notifyUpstreamRequest("proxy");
			const response = await fetchCatch(url, {
				method: "GET",
				size: 5 * 1000 * 1000,
				timeout: 10000,
				headers: {
					"User-Agent": UA_PROXY,
					"Accept": "text/html, application/json, application/xml, text/xml, application/rss+xml, application/atom+xml",
				},
			});
			if (!response.ok) {
				throw new UserError("Error fetching " + url + ": " + response.status);
			}
			const text = await response.text();

			const isHTML = response.headers.get("content-type")?.startsWith("text/html");
			console.log(response.headers.get("content-type"));
			console.log(url, isHTML ? "html" : "xml");
			const document = new JSDOM(text, { contentType: isHTML ? "text/html" : "application/xml" });
			console.log("Fetching ", url, document.window.document.children[0]);
			return document.window.document.children[0];
		});

		res.json(feeds.map(feed => ({
			type: FeedType[feed.type]?.toLowerCase(),
			title: feed.title,
			url: feed.url,
			number_of_articles: feed.numberOfArticles,
			number_of_images: feed.numberOfImages,
		 })));
	} catch (e: any) {
		next(e);
	}
});


Sentry.setupExpressErrorHandler(app);


app.use(function (err: any, _req: any, res: any, next: any) {
	console.error(err.stack);

	res.removeHeader("expires");
	res.append("max-age", "0");

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
