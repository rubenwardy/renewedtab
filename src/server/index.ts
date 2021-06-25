import express from "express";
import fs from "fs";
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
export const OWNER_EMAIL = process.env.OWNER_EMAIL ?? serverConfig.OWNER_EMAIL;
const DISCORD_WEBHOOK = process.env.DISCORD_WEBHOOK ?? serverConfig.DISCORD_WEBHOOK;
export const UA_DEFAULT = "Mozilla/5.0 (compatible; Renewed Tab App/1.7.0; +https://renewedtab.com/)";
export const UA_PROXY = "Mozilla/5.0 (compatible; Renewed Tab Proxy/1.7.0; +https://renewedtab.com/)";
const SENTRY_DSN = process.env.SENTRY_DSN;


// App

import { getWeatherInfo } from "./weather";
import { getBackground } from "./backgrounds";
import { handleProxy } from "./proxy";
import { getCoordsFromQuery } from "./geocode";
import getImageFromUnsplash from "./backgrounds/unsplash";
import { compareString } from "common/utils/string";
import SpaceLaunch from "common/api/SpaceLaunch";
import { getQuote, getQuoteCategories } from "./quotes";

const app = express();

Sentry.init({
	enabled: SENTRY_DSN != undefined,
	dsn: SENTRY_DSN,
	integrations: [
		new Sentry.Integrations.Http({ tracing: true }),
		new Tracing.Integrations.Express({ app }),
	],
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


app.get("/proxy/", async (req: express.Request, res: express.Response) => {
	if (!req.query.url) {
		writeClientError(res, "Missing URL");
		return;
	}

	try {
		const url = new URL(req.query.url as string);
		const result = await handleProxy(url);
		res.status(result.status).type(result.contentType).send(result.text);
	} catch (ex) {
		writeClientError(res, ex.message);
	}
});


app.get("/api/weather/", async (req: express.Request, res: express.Response) => {
	if (!req.query.long || !req.query.lat) {
		writeClientError(res, "Missing location");
		return;
	}

	try {
		res.json(await getWeatherInfo(
			Number.parseFloat(req.query.lat as string),
			Number.parseFloat(req.query.long as string)));
	} catch (ex) {
		writeClientError(res, ex.message);
	}
});


app.get("/api/geocode/", async (req: express.Request, res: express.Response) => {
	if (!req.query.q) {
		writeClientError(res, "Missing query");
		return;
	}

	try {
		res.json(await getCoordsFromQuery((req.query.q as string).trim()));
	} catch (ex) {
		writeClientError(res, ex.message);
	}
});


app.get("/api/background/", async (_req: express.Request, res: express.Response) => {
	try {
		res.json(await getBackground());
	} catch (ex) {
		writeClientError(res, ex.message);
	}
});


const backgroundVoteStream = fs.createWriteStream("votes.csv", { flags: "a" });
app.post("/api/background/vote/", async (req: express.Request, res: express.Response) => {
	try {
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
	} catch (ex) {
		writeClientError(res, ex.message);
	}
});


const reCollectionID = /^[0-9]+$/;
app.get("/api/unsplash/", async (req: express.Request, res: express.Response) => {
	try {
		const collection = req.query.collection as (string | undefined);
		if (!collection) {
			writeClientError(res, "Missing collection ID");
			return;
		}

		if (!reCollectionID.test(collection)) {
			writeClientError(res, "Invalid collection ID");
			return;
		}

		res.json(await getImageFromUnsplash(collection));
	} catch (ex) {
		writeClientError(res, ex.message);
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

		const launches: SpaceLaunch[] = result.map((launch: any) => ({
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
		writeClientError(res, ex.message);
	}
});

const feedbackStream = fs.createWriteStream("feedback.txt", { flags: "a" });
app.post("/api/feedback/", async (req: express.Request, res: express.Response) => {
	try {
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
	} catch (ex) {
		writeClientError(res, ex.message);
	}
});


function readAutocompleteFromFile(filename: string) {
	return fs.readFileSync(`src/server/data/${filename}.csv`)
		.toString()
		.split(/\r?\n/)
		.map(x => x.split(","))
		.filter(x => x.length == 2)
		.map(([label, value]) => ({ label: label.trim(), value: value.trim() }))
		.sort((a, b) => compareString(a.label, b.label));
}


const feeds = readAutocompleteFromFile("feeds");
const webcomics = readAutocompleteFromFile("webcomics");
app.get("/api/feeds/", async (_req: express.Request, res: express.Response) => {
	res.json(feeds);
});
app.get("/api/webcomics/", async (_req: express.Request, res: express.Response) => {
	res.json(webcomics);
});

app.post("/api/autocomplete/", async (req: express.Request, res: express.Response) => {
	try {
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
	} catch (ex) {
		writeClientError(res, ex.message);
	}
});


app.get("/api/quote-categories/", async (req: express.Request, res: express.Response) => {
	try {
		const quoteCategories = await getQuoteCategories();

		res.json(quoteCategories);
	} catch (ex) {
		writeClientError(res, ex.message);
	}
});


app.get("/api/quotes/", async (req: express.Request, res: express.Response) => {
	try {
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
	} catch (ex) {
		writeClientError(res, ex.message);
	}
});

app.use(Sentry.Handlers.errorHandler());

app.listen(PORT, () => {
	console.log(`⚡️[server]: Server is running in ${IS_DEBUG ? "debug" : "prod"} at http://localhost:${PORT}`);
});
