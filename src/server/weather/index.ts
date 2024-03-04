import { WeatherDay, WeatherHour, WeatherInfo } from "common/api/weather";
import { fetchRetry, Request } from "../http";
import { notifyUpstreamRequest } from "../metrics";
import { makeKeyCache } from "../cache";
import { getLocationFromCoords } from "./geocode";
import { handleAccuError, AccuCurrentAPI, AccuHourlyAPI, AccuDailyAPI } from "./accu";
import UserError from "server/UserError";
import { ACCUWEATHER_API_KEY, UA_DEFAULT } from "server/config";


const ACCU_ICONS_TO_OWM: Record<string, string> = {
	"sunny": "01d",
	"mostly sunny": "01d",
	"partly sunny": "01d",
	"intermittent clouds": "02d",
	"hazy sunshine": "01d",
	"mostly cloudy": "03d",
	"cloudy": "03d",
	"dreary (overcast)": "03d",
	"fog": "50d",
	"showers": "09d",
	"mostly cloudy w/ showers": "09d",
	"partly sunny w/ showers": "09d",
	"t-storms": "11d",
	"mostly cloudy w/ t-storms": "11d",
	"partly sunny w/ t-storms": "11d",
	"rain": "09d",
	"flurries": "09d",
	"mostly cloudy w/ flurries": "09d",
	"partly sunny w/ flurries": "09d",
	"snow": "13d",
	"mostly cloudy w/ snow": "13d",
	"ice": "13d",
	"sleet": "13d",
	"freezing rain": "09d",
	"rain and snow": "13d",
	"hot": "",
	"cold": "",
	"windy": "",
	"clear": "01n",
	"mostly clear": "01n",
	"partly cloudy": "02n",
	"intermittent clouds 2": "02n",
	"hazy moonlight": "02n",
	"mostly cloudy 2": "03n",
	"partly cloudy w/ showers": "09n",
	"mostly cloudy w/ showers 2": "09n",
	"partly cloudy w/ t-storms": "11n",
	"mostly cloudy w/ t-storms 2": "11n",
	"mostly cloudy w/ flurries 2": "13n",
	"mostly cloudy w/ snow ": "13n",
}


function getLegacyIcon(icon: number, phrase?: string): string | undefined {
	return ACCU_ICONS_TO_OWM[phrase?.toLowerCase() ?? ""] ??
		Object.values(ACCU_ICONS_TO_OWM)[icon];
}


function indexOfOrUndefined(str: string, searchString: string, position?: number) {
	const idx = str.indexOf(searchString, position);
	return idx == -1 ? undefined : idx;
}


/**
 * @param date A date like "2021-10-23T07:00:00+09:00"
 * @returns
 */
function dateToLocaltime(date: string) {
	const tIdx = date.indexOf("T");
	const zoneIdx = indexOfOrUndefined(date, "+", tIdx) ?? indexOfOrUndefined(date, "-", tIdx);
	const time = date.substring(tIdx + 1, zoneIdx).split(":");
	return `${time[0]}:${time[1]}`
}


/**
 * @param date A date like "2021-10-23T07:00:00+09:00"
 * @returns
 */
function dateToDayOfWeek(date: string) {
	const dateOnly = date.substring(0, date.indexOf("T"));
	return new Date(dateOnly).getUTCDay();
}


async function fetchCurrentForecast(key: string): Promise<AccuCurrentAPI> {
	if (!ACCUWEATHER_API_KEY) {
		throw new UserError("Weather API disabled as the server owner hasn't configured ACCUWEATHER_API_KEY.")
	}

	notifyUpstreamRequest("AccuWeather.com");

	const url = new URL(`http://dataservice.accuweather.com/currentconditions/v1/${key}`);
	url.searchParams.set("apikey", ACCUWEATHER_API_KEY);
	url.searchParams.set("details", "true");
	url.searchParams.set("metric", "true");

	const response = await fetchRetry(new Request(url, {
		method: "GET",
		headers: {
			"User-Agent": UA_DEFAULT,
			"Accept": "application/json",
		}
	}));

	if (!response.ok) {
		await handleAccuError(response);
	}

	const array = await response.json() as AccuCurrentAPI[];
	return array[0];
}


async function fetchHourlyForecast(key: string): Promise<WeatherHour[]> {
	if (!ACCUWEATHER_API_KEY) {
		throw new UserError("Weather API disabled as the server owner hasn't configured ACCUWEATHER_API_KEY.")
	}

	notifyUpstreamRequest("AccuWeather.com");

	const url = new URL(`http://dataservice.accuweather.com/forecasts/v1/hourly/12hour/${key}`);
	url.searchParams.set("apikey", ACCUWEATHER_API_KEY);
	url.searchParams.set("metric", "true");

	const response = await fetchRetry(new Request(url, {
		method: "GET",
		headers: {
			"User-Agent": UA_DEFAULT,
			"Accept": "application/json",
		}
	}));

	if (!response.ok) {
		await handleAccuError(response);
	}

	const json = await response.json() as AccuHourlyAPI;
	return json.map(hour => ({
		time: dateToLocaltime(hour.DateTime),
		temp: hour.Temperature.Value,
		icon: getLegacyIcon(hour.WeatherIcon, hour.IconPhrase),
		precipitation: hour.PrecipitationProbability,
	}));
}


async function fetchDailyForecast(key: string): Promise<WeatherDay[]> {
	if (!ACCUWEATHER_API_KEY) {
		throw new UserError("Weather API disabled as the server owner hasn't configured ACCUWEATHER_API_KEY.")
	}

	notifyUpstreamRequest("AccuWeather.com");

	const url = new URL(`http://dataservice.accuweather.com/forecasts/v1/daily/5day/${key}`);
	url.searchParams.set("apikey", ACCUWEATHER_API_KEY);
	url.searchParams.set("details", "true");
	url.searchParams.set("metric", "true");

	const response = await fetchRetry(new Request(url, {
		method: "GET",
		headers: {
			"User-Agent": UA_DEFAULT,
			"Accept": "application/json",
		}
	}));


	if (!response.ok) {
		await handleAccuError(response);
	}

	const json = await response.json() as AccuDailyAPI;
	return json.DailyForecasts.map(day => ({
		dayOfWeek: dateToDayOfWeek(day.Date),
		icon: getLegacyIcon(day.Day.Icon, day.Day.IconPhrase),
		minTemp: day.Temperature.Minimum.Value,
		maxTemp: day.Temperature.Maximum.Value,
		sunrise: day.Sun.Rise ? dateToLocaltime(day.Sun.Rise) : undefined,
		sunset: day.Sun.Set ? dateToLocaltime(day.Sun.Set) : undefined,
		precipitation: day.Day.PrecipitationProbability,
		wind_speed: Math.round(100 * day.Day.Wind.Speed.Value / 3.6) / 100,
	}));
}


async function fetchWeatherInfo(key: string): Promise<WeatherInfo> {
	const [current, hourly, daily] = await Promise.all([
		fetchCurrentForecast(key),
		fetchHourlyForecast(key),
		fetchDailyForecast(key),
	]);

	const estimatedPercipitation = hourly.slice(0, 4)
		.reduce((acc, x) => Math.max(acc, x.precipitation ?? 0), 0);

	return {
		current: {
			icon: getLegacyIcon(current.WeatherIcon, undefined),
			temp: current.Temperature.Metric.Value,
			feels_like: current.RealFeelTemperature.Metric.Value,
			pressure: current.Pressure.Metric.Value,
			humidity: current.RelativeHumidity,
			sunrise: daily[0]?.sunrise,
			sunset: daily[0]?.sunset,
			uvi: current.UVIndex,
			precipitation: current.PrecipitationProbability ?? estimatedPercipitation,
			wind_speed: Math.round(100 * current.Wind.Speed.Metric.Value / 3.6) / 100,
		},

		hourly,
		daily,

		url: current.Link.replace("http://", "https://"),
	};
}


export const getWeatherInfo: (key: string) => Promise<WeatherInfo>
	= makeKeyCache(fetchWeatherInfo, 2 * 60)


async function fetchWeatherInfoByCoords(lat: number, long: number): Promise<WeatherInfo> {
	const location = await getLocationFromCoords(lat, long);
	return await getWeatherInfo(location[0].key);
}


export const getWeatherInfoByCoords: (lat: number, long: number) => Promise<WeatherInfo>
	= makeKeyCache(fetchWeatherInfoByCoords, 1 * 60,
		(lat, long) => `${lat.toFixed(2)},${long.toFixed(2)}`)
