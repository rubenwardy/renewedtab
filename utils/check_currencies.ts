const nodeFetch = require("node-fetch");

const cache = new Map<string, Record<string, number>>();

/**
 * Gets exchange rates between `base` and all other currencies
 *
 * @param base 3 letter code
 * @returns Exchange rates
 */
async function getBase(base: string): Promise<Record<string, number>> {
	if (cache.has(base)) {
		return cache.get(base)!;
	}

	const url = new URL("https://api.exchangerate.host/latest");
	url.searchParams.set("base", base);
	url.searchParams.set("places", "30");

	const ret = await nodeFetch(new nodeFetch.Request(url.toString(), {
		method: "GET",
		timeout: 10000,
		headers: {
			"Accept": "application/json",
		},
	}));

	const rates = (await ret.json()).rates as Record<string, any>;
	if (typeof rates != "object") {
		throw new Error("Invalid response from API");
	}
	for (const key in rates)  {
		rates[key] = parseFloat(rates[key]);
	}
	cache.set(base, rates);
	return rates;
}


/**
 * Get how much 1 `from` is in `to`
 *
 * @param from 3 letter code
 * @param to 3 letter code
 * @returns
 */
async function getDirect(from: string, to: string): Promise<number> {
	const rates = await getBase(from);
	if (rates[to] == undefined) {
		throw new Error(`Unable to get ${to} in ${from}`);
	}
	return rates[to];
}


/**
 * Get how much 1 `from` is in `to`
 *
 * @param from 3 letter code
 * @param to 3 letter code
 * @returns
 */
async function getIndirect(from: string, to: string): Promise<number> {
	const rates = await getBase("USD");
	if (rates[from] == undefined) {
		throw new Error(`Unable to get ${from} in USD`);
	}
	if (rates[to] == undefined) {
		throw new Error(`Unable to get ${to} in USD}`);
	}
	const usdInFrom = rates[from];
	const usdInTo = rates[to];
	return usdInTo / usdInFrom;
}


async function getReport(from: string, to: string) {
	const direct = await getDirect(from, to);
	const indirect = await getIndirect(from, to);
	const diff = indirect - direct;
	const perc = 100 * (1 - Math.abs(diff) / direct);
	return `${from}🠒${to}: ${direct.toFixed(2)} direct, ${indirect.toFixed(2)} indirect: ${perc.toFixed(3)}% accuracy, ${diff.toFixed(2)} off`;
}


Promise.all([
	getReport("GBP", "EUR"),
	getReport("GBP", "JPY"),
	getReport("BTC", "GBP"),
	getReport("BTC", "USD"),
]).then(x => x.join("\n")).then(console.log).catch(console.error)
