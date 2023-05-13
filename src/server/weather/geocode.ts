import fetchCatch, { Request } from "../http";
import { Location } from "common/api/weather";
import { notifyUpstreamRequest } from "../metrics";
import { makeKeyCache } from "../cache";
import { AccuLocation, handleAccuError } from "./accu";
import UserError from "server/UserError";
import { ACCUWEATHER_API_KEY, UA_DEFAULT } from "server/config";


function getLocationName(loc: AccuLocation): string {
	const parts = [
		loc.LocalisedName ?? loc.EnglishName ?? "?",
		loc.AdministrativeArea?.LocalizedName ?? loc.AdministrativeArea?.EnglishName,
		loc.Country?.LocalizedName ?? loc.Country?.EnglishName,
	];

	return parts.filter(x => x).join(", ");
}

async function fetchLocationsFromQuery(query: string): Promise<Location[]> {
	if (!ACCUWEATHER_API_KEY) {
		throw new UserError("Weather API disabled as the server owner hasn't configured ACCUWEATHER_API_KEY.")
	}

	const url = new URL("http://dataservice.accuweather.com/locations/v1/search");
	url.searchParams.set("q", query);
	url.searchParams.set("apikey", ACCUWEATHER_API_KEY);

	notifyUpstreamRequest("AccuWeather.com");

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

	const json: AccuLocation[] = await response.json();

	return json.slice(0, 5).map(loc => ({
		key: loc.Key,
		name: getLocationName(loc),
		latitude: loc.GeoPosition.Latitude,
		longitude: loc.GeoPosition.Longitude
	}));
}


async function fetchLocationsFromCoord(lat: number, long: number): Promise<Location[]> {
	if (!ACCUWEATHER_API_KEY) {
		throw new UserError("Weather API disabled as the server owner hasn't configured ACCUWEATHER_API_KEY.")
	}

	const url = new URL("http://dataservice.accuweather.com/locations/v1/cities/geoposition/search");
	url.searchParams.set("q", `${lat},${long}`);
	url.searchParams.set("apikey", ACCUWEATHER_API_KEY);

	notifyUpstreamRequest("AccuWeather.com");

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

	const json = await response.json() as AccuLocation;
	return [
		{
			key: json.Key,
			name: getLocationName(json),
			latitude: json.GeoPosition.Latitude,
			longitude: json.GeoPosition.Longitude,
		}
	];
}


export const getCoordsFromQuery: (query: string) => Promise<Location[]>
	= makeKeyCache(fetchLocationsFromQuery, 0);

export const getLocationFromCoords: (lat: number, long: number) => Promise<Location[]>
	= makeKeyCache(fetchLocationsFromCoord, 0,
		(lat, long) => `${lat.toFixed(3)},${long.toFixed(3)}`);
