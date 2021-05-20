import fetchCatch, { Request } from "./http";
import { OWNER_EMAIL, UA_DEFAULT } from ".";
import { Location } from "common/api/weather";

interface OSMLocation {
	lat: string;
	lon: string;
	display_name: string;
}

const cache = new Map<string, Location[]>();

export async function getCoordsFromQuery(query: string): Promise<Location[]> {
	if (!OWNER_EMAIL || !OWNER_EMAIL.includes("@")) {
		throw new Error("Geocoding API disabled as the server owner hasn't configured OWNER_EMAIL.")
	}

	if (cache.has(query)) {
		return cache.get(query) as Location[];
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
		throw new Error(`Error getting location, ${response.statusText}.`);
	}

	const json: OSMLocation[] = await response.json();

	const retval : Location[] = json.map(loc => ({
		name: loc.display_name,
		latitude: Number.parseFloat(loc.lat),
		longitude: Number.parseFloat(loc.lon)
	}));

	cache.set(query, retval);
	return retval;
}
