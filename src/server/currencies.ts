import { CurrencyInfo } from "common/api/currencies";
import { makeSingleCache } from "./cache";
import fetchCatch, {Request} from "./http";
import UserError from "./UserError";
import { EXCHANGERATE_API_KEY, UA_DEFAULT } from "./config";


const shitCoins = new Set([
 	"BTC", "ETH", "USDT", "BNB", "ADA", "DOGE", "XRP", "USDC", "DOT", "UNI",
]);


/**
 * Get info about symbols, like the description
 *
 * @returns Map of currency key to info
 */
async function fetchSymbols(): Promise<Record<string, CurrencyInfo>> {
	const url = new URL("http://api.exchangerate.host/list");
	url.searchParams.set("access_key", EXCHANGERATE_API_KEY);

	const response = await fetchCatch(new Request(url, {
		method: "GET",
		size: 0.1 * 1000 * 1000,
		timeout: 10000,
		headers: {
			"User-Agent": UA_DEFAULT,
			"Accept": "application/json",
		},
	}));

	if (!response.headers.get("content-type")?.includes("application/json")) {
		throw new UserError(await response.text());
	}

	const json = await response.json();
	if (!response) {
		throw new UserError(json?.error?.info ?? "Unknown error from upstream API");
	}

	const retval: Record<string, CurrencyInfo> = {};
	Object.entries(json.currencies as Record<string, string>)
		.forEach(([key, description]) => {
			retval[key] = {
				code: key,
				description,
				value_in_usd: NaN,
				is_crypto: shitCoins.has(key),
			 };
		});

	return retval;
}


async function fetchLiveValues(rates: Record<string, number>): Promise<void> {
	const url = new URL("http://api.exchangerate.host/live")
	url.searchParams.set("access_key", EXCHANGERATE_API_KEY);
	url.searchParams.set("base", "USD");
	url.searchParams.set("places", "10");

	// TODO: this API only returns BTC, use another API for crypto

	const response = await fetchCatch(new Request(url, {
		method: "GET",
		timeout: 10000,
		headers: {
			"User-Agent": UA_DEFAULT,
			"Accept": "application/json",
		},
	}));

	if (!response.headers.get("content-type")?.includes("application/json")) {
		throw new UserError(await response.text());
	}

	const json = await response.json();
	if (!response) {
		throw new UserError(json?.error?.info ?? "Unknown error from upstream API");
	}

	Object.entries(json.quotes as Record<string, string>).forEach(([key, value]) => {
		const withoutUSD = key.slice(3);
		rates[withoutUSD] = parseFloat(value);
	});
}


async function fetchCurrencies(): Promise<Record<string, CurrencyInfo>> {
	const symbols = await fetchSymbols();

	const rates: Record<string, number> = {};
	await fetchLiveValues(rates);

	rates["USD"] = 1;

	for (const key in symbols)  {
		const currency = symbols[key];
		currency.value_in_usd = rates[key];
		if (!currency.value_in_usd || isNaN(currency.value_in_usd)) {
			delete symbols[key];
		}
	}

	return symbols;
}


export const getCurrencies = makeSingleCache(fetchCurrencies, 120);
