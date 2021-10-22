import { WeatherInfo } from "common/api/weather";
import fetchCatch, { Request } from "./http";
import { OPEN_WEATHER_MAP_API_KEY, UA_DEFAULT } from ".";
import { notifyUpstreamRequest } from "./metrics";
import { makeKeyCache } from "./cache";


interface OWMBase {
	dt: number;
	pressure: number;
	humidity: number;
	dew_point: number;
	uvi: number;
	clouds: number;
	visibility: number;
	wind_speed: number;
	wind_deg: number;
	wind_gust?: number;
	weather: { icon: string }[];
}

interface OWMCurrent extends OWMBase {
	sunrise: number;
	sunset: number;
	temp: number;
	feels_like: number;
}

interface OWMHourly extends OWMBase {
	temp: number;
	feels_like: number;
}

interface OWMDaily extends OWMBase {
	sunrise: number;
	sunset: number;
	temp: {
		day: number;
		min: number;
		max: number;
	}
}

interface OWMOneCall {
	timezone_offset: number;

	current: OWMCurrent;
	hourly: OWMHourly[];
	daily: OWMDaily[];
}


function parseWeatherInfo(info: OWMOneCall): WeatherInfo {
	function unixToDate(unix: number): Date {
		return new Date((unix + info.timezone_offset) * 1000);
	}

	function unixToTime(unix: number): string {
		const date = unixToDate(unix);
		return `${date.getUTCHours().toString().padStart(2, "0")}:${date.getUTCMinutes().toString().padStart(2, "0")}`;
	}

	function kelvinToCelsius(k: number) {
		return k - 272.15;
	}

	function getIcon(forecast: OWMBase): string | undefined {
		return forecast.weather[0]?.icon;
	}

	const daily = info.daily.map(day => ({
		dayOfWeek: unixToDate(day.dt).getUTCDay(),
		icon: getIcon(day),
		minTemp: kelvinToCelsius(day.temp.min),
		maxTemp: kelvinToCelsius(day.temp.max),
		sunrise: unixToTime(day.sunrise),
		sunset: unixToTime(day.sunset),
	}));

	return {
		timezone_offset: info.timezone_offset,
		current: {
			icon: getIcon(info.current),
			temp: kelvinToCelsius(info.current.temp),
			feels_like: kelvinToCelsius(info.current.feels_like),
			pressure: info.current.pressure,
			humidity: info.current.humidity,
			sunrise: unixToTime(info.current.sunrise),
			sunset: unixToTime(info.current.sunset),
			uvi: info.current.uvi,
			wind_speed: info.current.wind_speed,
		},
		hourly: info.hourly.map(hour => ({
			time: unixToTime(hour.dt),
			temp: kelvinToCelsius(hour.temp),
			icon: hour.weather[0]?.icon,
		})),
		daily: daily,
		forecast: daily,
	}
}


async function fetchWeatherInfo(lat: number, long: number): Promise<WeatherInfo> {
	notifyUpstreamRequest("OpenWeatherMap.org");

	const url = new URL("https://api.openweathermap.org/data/2.5/onecall");
	url.searchParams.set("lon", long.toString());
	url.searchParams.set("lat", lat.toString());
	url.searchParams.set("appid", OPEN_WEATHER_MAP_API_KEY);
	url.searchParams.set("exclude", "minutely,alerts");

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


export const getWeatherInfo: (lat: number, long: number) => Promise<WeatherInfo>
	= makeKeyCache(fetchWeatherInfo, 2 * 60,
		(lat, long) => `${lat.toFixed(3)},${long.toFixed(3)}`)
