import express from 'express';
import fetch, { Request } from 'node-fetch';

const app = express();
const PORT = 8000;

const WHITELISTED_HOSTS = new Set([
	"forecast7.com",
	"bbci.com"
]);

app.use((_req, res, next) => {
	res.append('Access-Control-Allow-Origin', ['*']);
	res.append('Access-Control-Allow-Methods', 'GET');
	res.append('Access-Control-Allow-Headers', 'Content-Type');
	next();
});

app.get('/', async (req: express.Request, res: express.Response) => {
	if (!req.query.url) {
		res.status(400).send("Missing URL");
		return;
	}

	const url = new URL(req.query.url as string);
	if (!WHITELISTED_HOSTS.has(url.host)) {
		res.status(403).send("Host not allowed");
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
