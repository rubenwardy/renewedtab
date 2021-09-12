import fetchCatch, { Request } from "./http";
import { OPEN_WEATHER_MAP_API_KEY, OWNER_EMAIL, UA_DEFAULT } from ".";
import { Location } from "common/api/weather";
import { notifyUpstreamRequest } from "./metrics";
import { makeKeyCache } from "./cache";

interface OSMLocation {
	lat: string;
	lon: string;
	display_name: string;
}

interface OWMLocation {
	name: string,
	lat: number,
	lon: number;
}

async function fetchCoordsFromQuery(query: string): Promise<Location[]> {
	if (!OWNER_EMAIL || !OWNER_EMAIL.includes("@")) {
		throw new Error("Geocoding API disabled as the server owner hasn't configured OWNER_EMAIL.")
	}

	const url = new URL("https://nominatim.openstreetmap.org/search");
	url.searchParams.set("q", query);
	url.searchParams.set("format", "jsonv2");
	url.searchParams.set("email", OWNER_EMAIL);
	url.searchParams.set("limit", "5");

	notifyUpstreamRequest("OpenStreetMap.org");

	const response = await fetchCatch(new Request(url, {
		method: "GET",
		headers: {
			"User-Agent": UA_DEFAULT,
			"Accept": "application/json",
		}
	}));

	if (!response.ok) {
		throw new Error(`Error getting location, ${response.statusText}.`);
	}

	const json: OSMLocation[] = await response.json();

	const retval : Location[] = json.map(loc => ({
		name: loc.display_name,
		latitude: Number.parseFloat(loc.lat),
		longitude: Number.parseFloat(loc.lon)
	}));

	return retval;
}


async function fetchPlaceInfoFromLocation(lat: number, long: number): Promise<Location[]> {
	if (!OWNER_EMAIL || !OWNER_EMAIL.includes("@")) {
		throw new Error("Geocoding API disabled as the server owner hasn't configured OWNER_EMAIL.")
	}

	const url = new URL("https://api.openweathermap.org/geo/1.0/reverse");
	url.searchParams.set("lat", lat.toString());
	url.searchParams.set("lon", long.toString());
	url.searchParams.set("appid", OPEN_WEATHER_MAP_API_KEY);
	url.searchParams.set("limit", "5");

	notifyUpstreamRequest("OpenWeatherMap.org");

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
			throw new Error("Too many requests to geo lookup API service.");
		} else {
			throw new Error(`Error getting location, ${response.statusText}.`);
		}
	}

	if (!Array.isArray(json) || json.length == 0) {
		return [];
	}

	return (json as OWMLocation[])
		.filter((value, index, self) => self.findIndex(x => x.name == value.name) == index)
		.map(location => ({
			name: location.name,
			latitude: location.lat,
			longitude: location.lon,
		}));
}


export const getCoordsFromQuery: (query: string) => Promise<Location[]>
	= makeKeyCache(fetchCoordsFromQuery, 0);

export const getPlaceInfoFromLocation: (lat: number, long: number) => Promise<Location[]>
	= makeKeyCache(fetchPlaceInfoFromLocation, 0,
		(lat, long) => `${lat.toFixed(3)},${long.toFixed(3)}`);
