import fetch, { Request } from "node-fetch";
import { IS_DEBUG, serverConfig, UA_DEFAULT } from "./server";

const OPEN_WEATHER_MAP_API_KEY =
	process.env.OPEN_WEATHER_MAP_API_KEY ?? serverConfig.OPEN_WEATHER_MAP_API_KEY;

function parseWeatherInfo(info: any): any {
	function unixToDate(unix: number): Date {
		return new Date((unix + info.timezone_offset) * 1000);
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
		timezone_offset: info.timezone_offset,
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
if (!IS_DEBUG) {
	setInterval(() => {
		cache.clear();
	}, 15 * 60 * 1000);
}

export async function getWeatherInfo(lat: number, long: number): Promise<any> {
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
			"User-Agent": UA_DEFAULT,
			"Accept": "application/json",
		}
	}));

	const json = JSON.parse(await response.text());
	if (!response.ok) {
		if (json.message && json.message.includes("requests limitation")) {
			throw Error("Too many requests to Weather API service.");
		} else {
			throw Error(`Error getting weather, ${response.statusText}.`);
		}
	}

	const ret = parseWeatherInfo(json);
	cache.set(key, ret);
	return ret;
}
