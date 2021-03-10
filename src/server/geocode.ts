import fetchCatch, { Request } from "./http";
import { OWNER_EMAIL, UA_DEFAULT } from "./server";

interface OSMLocation {
	lat: string;
	lon: string;
	display_name: string;
}

interface Location {
	name: string;
	latitude: number;
	longitude: number;
}

const cache = new Map<string, Location[]>();

export async function getCoordsFromQuery(query: string) {
	if (!OWNER_EMAIL || !OWNER_EMAIL.includes("@")) {
		throw Error("Geocoding API disabled as the server owner hasn't configured OWNER_EMAIL.")
	}

	if (cache.has(query)) {
		return cache.get(query);
	}

	const url = new URL("https://nominatim.openstreetmap.org/search");
	url.searchParams.set("q", query);
	url.searchParams.set("format", "jsonv2");
	url.searchParams.set("email", OWNER_EMAIL);
	url.searchParams.set("limit", "5");

	const response = await fetchCatch(new Request(url, {
		method: "GET",
		headers: {
			"User-Agent": UA_DEFAULT,
			"Accept": "application/json",
		}
	}));

	if (!response.ok) {
		throw Error(`Error getting location, ${response.statusText}.`);
	}

	const json: OSMLocation[] = JSON.parse(await response.text());

	const retval : Location[] = json.map(loc => ({
		name: loc.display_name,
		latitude: Number.parseFloat(loc.lat),
		longitude: Number.parseFloat(loc.lon)
	}));

	cache.set(query, retval);
	return retval;
}
