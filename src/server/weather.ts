import { WeatherInfo } from "common/api/weather";
import fetchCatch, { Request } from "./http";
import { serverConfig, UA_DEFAULT } from ".";
import { notifyUpstreamRequest } from "./metrics";
import { makeKeyCache } from "./cache";

const OPEN_WEATHER_MAP_API_KEY =
	process.env.OPEN_WEATHER_MAP_API_KEY ?? serverConfig.OPEN_WEATHER_MAP_API_KEY;

function parseWeatherInfo(info: any): WeatherInfo {
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
			dayOfWeek: unixToDate(day.dt).getDay(),
			icon: getIcon(day),
			minTemp: kelvinToCelsius(day.temp.min),
			maxTemp: kelvinToCelsius(day.temp.max),
			sunrise: unixToTime(day.sunrise),
			sunset: unixToTime(day.sunset),
		})),
	}
}


async function fetchWeatherInfo(lat: number, long: number): Promise<any> {
	notifyUpstreamRequest("OpenWeatherMap.org");

	const url = new URL("https://api.openweathermap.org/data/2.5/onecall");
	url.searchParams.set("lon", long.toString());
	url.searchParams.set("lat", lat.toString());
	url.searchParams.set("appid", OPEN_WEATHER_MAP_API_KEY);
	url.searchParams.set("exclude", "minutely,hourly");

	const response = await fetchCatch(new Request(url, {
		method: "GET",
		headers: {
			"User-Agent": UA_DEFAULT,
			"Accept": "application/json",
		}
	}));

	const json = await response.json();
	if (!response.ok) {
		if (json.message && json.message.includes("requests limitation")) {
			throw new Error("Too many requests to Weather API service.");
		} else {
			throw new Error(`Error getting weather, ${response.statusText}.`);
		}
	}

	return parseWeatherInfo(json);
}


export const getWeatherInfo: (lat: number, long: number) => Promise<any>
	= makeKeyCache(fetchWeatherInfo, 3 * 60,
		(lat, long) => `${lat.toFixed(3)},${long.toFixed(3)}`)
