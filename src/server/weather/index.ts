import { WeatherCurrent, WeatherDay, WeatherHour, WeatherInfo } from "common/api/weather";
import fetchCatch, { Request } from "../http";
import { ACCUWEATHER_API_KEY, UA_DEFAULT } from "..";
import { notifyUpstreamRequest } from "../metrics";
import { makeKeyCache } from "../cache";
import { getLocationFromCoords } from "./geocode";
import { handleAccuError, AccuCurrentAPI, AccuHourlyAPI, AccuDailyAPI } from "./accu";
import UserError from "server/UserError";


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
 *
 * @param date A date like "2021-10-23T07:00:00+09:00"
 * @returns
 */
function dateToLocaltime(date: string) {
	const tIdx = date.indexOf("T");
	const zoneIdx = indexOfOrUndefined(date, "+", tIdx) ?? indexOfOrUndefined(date, "-", tIdx);
	const time = date.substring(tIdx + 1, zoneIdx).split(":");
	return `${time[0]}:${time[1]}`
}


async function fetchCurrentForecast(key: string): Promise<WeatherCurrent> {
	if (!ACCUWEATHER_API_KEY) {
		throw new UserError("Weather API disabled as the server owner hasn't configured ACCUWEATHER_API_KEY.")
	}

	notifyUpstreamRequest("AccuWeather.com");

	const url = new URL(`http://dataservice.accuweather.com/currentconditions/v1/${key}`);
	url.searchParams.set("apikey", ACCUWEATHER_API_KEY);
	url.searchParams.set("details", "true");
	url.searchParams.set("metric", "true");

	const response = await fetchCatch(new Request(url, {
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
	const json = array[0];
	return {
		icon: getLegacyIcon(json.WeatherIcon, undefined),
		temp: json.Temperature.Metric.Value,
		feels_like: json.RealFeelTemperature.Metric.Value,
		pressure: json.Pressure.Metric.Value,
		humidity: json.RelativeHumidity,
		sunrise: undefined,
		sunset: undefined,
		uvi: json.UVIndex,
		wind_speed: json.Wind.Speed.Metric.Value,
		precipitationProbability: json.PrecipitationProbability ?? 13,
	};
}


async function fetchHourlyForecast(key: string): Promise<WeatherHour[]> {
	if (!ACCUWEATHER_API_KEY) {
		throw new UserError("Weather API disabled as the server owner hasn't configured ACCUWEATHER_API_KEY.")
	}

	notifyUpstreamRequest("AccuWeather.com");

	const url = new URL(`http://dataservice.accuweather.com/forecasts/v1/hourly/12hour/${key}`);
	url.searchParams.set("apikey", ACCUWEATHER_API_KEY);
	url.searchParams.set("metric", "true");

	const response = await fetchCatch(new Request(url, {
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
		precipitationProbability: hour.PrecipitationProbability,
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

	const response = await fetchCatch(new Request(url, {
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
		dayOfWeek: new Date(day.Date).getUTCDay(),
		icon: getLegacyIcon(day.Day.Icon, day.Day.IconPhrase),
		minTemp: day.Temperature.Minimum.Value,
		maxTemp: day.Temperature.Maximum.Value,
		sunrise: dateToLocaltime(day.Sun.Rise),
		sunset: dateToLocaltime(day.Sun.Set),
	}));
}


async function fetchWeatherInfo(key: string): Promise<WeatherInfo> {
	const [current, hourly, daily] = await Promise.all([
		fetchCurrentForecast(key),
		fetchHourlyForecast(key),
		fetchDailyForecast(key),
	]);

	current.sunrise = daily[0]?.sunrise;
	current.sunset = daily[0]?.sunset;

	return { current, hourly, daily };
}

export const getWeatherInfo: (key: string) => Promise<WeatherInfo>
	= makeKeyCache(fetchWeatherInfo, 2 * 60)


async function fetchWeatherInfoByCoords(lat: number, long: number): Promise<WeatherInfo> {
	const location = await getLocationFromCoords(lat, long);
	return await getWeatherInfo(location[0].key);
}

export const getWeatherInfoByCoords: (lat: number, long: number) => Promise<WeatherInfo>
	= makeKeyCache(fetchWeatherInfoByCoords, 2 * 60,
		(lat, long) => `${lat.toFixed(3)},${long.toFixed(3)}`)
