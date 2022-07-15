export interface CurrencyInfo {
	code: string;
	description: string;
	is_crypto: boolean;

	// This is actually the value of 1 USD
	value_in_usd: number;
}


/**
 * Calculates exchange rate from `from` to `to.
 *
 * ie: 1 `from` is how many `to`?
 *
 * @param currencies Dictionary of currency information
 * @param from
 * @param to
 * @returns Exchange rage
 */
export function calculateExchangeRate(currencies: Record<string, CurrencyInfo>, from: string, to: string): number {
	const usdInFrom = currencies[from].value_in_usd;
	const usdInTo = currencies[to].value_in_usd;
	return usdInTo / usdInFrom;
}
