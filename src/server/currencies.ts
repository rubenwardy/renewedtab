import { CurrencyInfo } from "common/api/currencies";
import { UA_DEFAULT } from "server";
import { makeSingleCache } from "./cache";
import fetchCatch, {Request} from "./http";


const shitCoins: Record<string, string> = {
	"BTC": "Bitcoin",
	"ETH": "Ethereum",
	"USDT": "Tether",
	"BNB": "Binance Coin",
	"ADA": "Cardana",
	"DOGE": "Dogecoin",
	"XRP": "XRP",
	"USDC": "USD Coin",
	"DOT": "Polkadot",
	"UNI": "Uniswap",
};


async function fetchSymbols(): Promise<Record<string, CurrencyInfo>> {
	const ret = await fetchCatch(new Request("https://api.exchangerate.host/symbols", {
		method: "GET",
		size: 0.1 * 1000 * 1000,
		timeout: 10000,
		headers: {
			"User-Agent": UA_DEFAULT,
			"Accept": "application/json",
		},
	}));

	const retval: Record<string, CurrencyInfo> = {};

	Object.entries((await ret.json()).symbols as Record<string, CurrencyInfo>)
		.forEach(([key, {code, description}]) => {
			retval[key] = {
				code,
				description,
				value_in_usd: NaN,
				is_crypto: false,
			 };
		});

	Object.entries(shitCoins).forEach(([code, description]) => {
		retval[code] = {
			code,
			description,
			value_in_usd: NaN,
			is_crypto: true,
		}
	});

	return retval;
}


async function fetchForexRates(rates: Record<string, number>): Promise<void> {
	const url = new URL("https://api.exchangerate.host/latest");
	url.searchParams.set("base", "USD");
	url.searchParams.set("places", "10");

	const ret = await fetchCatch(new Request(url, {
		method: "GET",
		timeout: 10000,
		headers: {
			"User-Agent": UA_DEFAULT,
			"Accept": "application/json",
		},
	}));

	const json = await ret.json();
	Object.entries(json.rates as Record<string, string>).forEach(([key, value]) => {
		rates[key] = parseFloat(value);
	});
}


async function fetchCryptoRates(rates: Record<string, number>): Promise<void> {
	const url = new URL("https://api.exchangerate.host/latest");
	url.searchParams.set("base", "USD");
	url.searchParams.set("source", "crypto");
	url.searchParams.set("places", "10");
	url.searchParams.set("symbols", Object.keys(shitCoins).join(","));

	const ret = await fetchCatch(new Request(url, {
		method: "GET",
		timeout: 10000,
		headers: {
			"User-Agent": UA_DEFAULT,
			"Accept": "application/json",
		},
	}));

	const json = await ret.json();
	Object.entries(json.rates as Record<string, string>).forEach(([key, value]) => {
		rates[key] = parseFloat(value);
	});
}


async function fetchCurrencies(): Promise<Record<string, CurrencyInfo>> {
	const symbols = await fetchSymbols();

	const rates: Record<string, number> = {};
	await fetchForexRates(rates);
	await fetchCryptoRates(rates);

	for (const key in symbols)  {
		const currency = symbols[key];
		currency.value_in_usd = rates[key];
		if (!currency.value_in_usd || isNaN(currency.value_in_usd)) {
			delete symbols[key];
		}
	}

	return symbols;
}


export const getCurrencies = makeSingleCache(fetchCurrencies, 15);
