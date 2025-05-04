import { CurrencyInfo } from "common/api/currencies";
import { makeSingleCache } from "./cache";
import fetchCatch, {Request, Response} from "./http";
import UserError from "./UserError";
import { OPEN_EXCHANGE_RATES_KEY, UA_DEFAULT } from "./config";
import { notifyUpstreamRequest } from "./metrics";


const shitCoins = new Set([
 	"BTC", "ETH", "USDT", "BNB", "ADA", "DOGE", "XRP", "USDC", "DOT", "UNI",
]);


function checkError(response: Response, json: any) {
	if (!response.ok || json?.success === false) {
		console.log(json);
		throw new UserError("Unknown error from upstream API");
	}
}

type SymbolsAPI = Record<string, string>;

interface RatesAPI {
	rates: Record<string, number>;
}



/**
 * Get info about symbols, like the description
 *
 * @returns Map of currency key to info
 */
async function fetchSymbols(): Promise<Record<string, CurrencyInfo>> {
	const url = new URL("https://openexchangerates.org/api/currencies.json");
	url.searchParams.set("app_id", OPEN_EXCHANGE_RATES_KEY);

	notifyUpstreamRequest("OpenExchangeRates.host");

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

	const json: SymbolsAPI = await response.json();
	checkError(response, json);

	const retval: Record<string, CurrencyInfo> = {};
	Object.entries(json)
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
	const url = new URL("https://openexchangerates.org/api/latest.json")
	url.searchParams.set("app_id", OPEN_EXCHANGE_RATES_KEY);

	notifyUpstreamRequest("OpenExchangeRates.host");

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

	const json: RatesAPI = await response.json();
	checkError(response, json);

	Object.entries(json.rates).forEach(([key, value]) => {
		rates[key] = Number(value);
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


export const getCurrencies = makeSingleCache(fetchCurrencies, 24*60);
