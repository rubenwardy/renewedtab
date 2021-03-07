import express from "express";
import fetch, { Request } from "node-fetch";
import fs from "fs";

const app = express();
const PORT = process.env.PORT ?? 8000;

const config = JSON.parse(fs.readFileSync("config.json").toString());

const PROXY_ALLOWED_HOSTS = new Set(config.PROXY_ALLOWED_HOSTS);

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
		res.status(403).send(`Host ${url.host} not allowed`);
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

app.listen(PORT, () => {
	console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});
