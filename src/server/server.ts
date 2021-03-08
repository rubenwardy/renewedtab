import express from "express";
import fetch, { Request } from "node-fetch";
import fs from "fs";

const app = express();
const PORT = process.env.PORT ?? 8000;

const config = JSON.parse(fs.readFileSync("config.json").toString());
const OPEN_WEATHER_MAP_API_KEY = process.env.OPEN_WEATHER_MAP_API_KEY || config.OPEN_WEATHER_MAP_API_KEY;
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


function parseWeatherInfo(info: any): any {
	function unixToDate(unix: number): Date {
		return new Date(unix * 1000);
	}

	function unixToDay(unix: number): string {
		const DAY_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
		return DAY_OF_WEEK[unixToDate(unix).getDay()];
	}

	function unixToTime(unix: number): string {
		const date = unixToDate(unix);
		return `${date.getHours()}:${date.getMinutes()}`;
	}

	function kelvinToCelsius(k: number) {
		return k - 272.15;
	}

	function getIcon(forecast: any): string | undefined {
		return forecast.weather[0]?.icon;
	}

	return {
		current: {
			icon: getIcon(info.current),
			temp: kelvinToCelsius(info.current.temp)
		},
		forecast: info.daily.map((day: any) => ({
			day: unixToDay(day.dt),
			icon: getIcon(day),
			minTemp: kelvinToCelsius(day.temp.min),
			maxTemp: kelvinToCelsius(day.temp.max),
			sunrise: unixToTime(day.sunrise),
			sunset: unixToTime(day.sunset),
		})),
	}
}


const cache = new Map<string, any>();
async function getWeatherInfo(lat: number, long: number): Promise<any> {
	const key = `${lat.toFixed(5)},${long.toFixed(5)}`;
	if (cache.has(key)) {
		console.log("Using cached weather");
		return cache.get(key);
	}

	const url = new URL("https://api.openweathermap.org/data/2.5/onecall");
	url.searchParams.set("lon", long.toString());
	url.searchParams.set("lat", lat.toString());
	url.searchParams.set("appid", OPEN_WEATHER_MAP_API_KEY);
	url.searchParams.set("exclude", "minutely,hourly");

	const response = await fetch(new Request(url, {
		method: "GET",
		headers: {
			"Accept": "application/json",
		}
	}));

	const text = await response.text();
	const json = parseWeatherInfo(JSON.parse(text));
	cache.set(key, json);
	return json;
}


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
		res.status(404).send(ex.message);
	}
});


app.listen(PORT, () => {
	console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});
