import fetchCatch, { Request } from "./http";
import { OWNER_EMAIL, UA_DEFAULT } from ".";
import { Location } from "common/api/weather";
import { notifyUpstreamRequest } from "./metrics";
import { makeKeyCache } from "./cache";

interface OSMLocation {
	lat: string;
	lon: string;
	display_name: string;
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


export const getCoordsFromQuery: (query: string) => Promise<Location[]>
	= makeKeyCache(fetchCoordsFromQuery, 100000);
