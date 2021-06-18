import { Quote, QuoteCategory } from "common/api/quotes";
import { UA_DEFAULT } from "server";
import { makeKeyCache } from "./cache";
import fetchCatch, { Request } from "./http";


export async function getQuoteCategories(): Promise<QuoteCategory[]> {
	return [
		{
			"id": "inspire",
			"text": "Inspiring"
		},
		{
			"id": "management",
			"text": "Management"
		},
		{
			"id": "sports",
			"text": "Sports"
		},
		{
			"id": "life",
			"text": "Life"
		},
		{
			"id": "funny",
			"text": "Funny"
		},
		{
			"id": "love",
			"text": "Love"
		},
		{
			"id": "art",
			"text": "Art"
		},
		{
			"id": "students",
			"text": "For students"
		}
	] as QuoteCategory[];
}


async function fetchQuotes(category: string): Promise<Quote[]> {
	const url = new URL("https://quotes.rest/qod");
	url.searchParams.set("category", category);
	console.log(url.toString())

	const response = await fetchCatch(
		new Request(url.toString(), {
			method: "GET",
			headers: {
				"User-Agent": UA_DEFAULT,
				"Accept": "application/json",
			}
		}));

	const json = await response.json();
	const quotes = json?.contents?.quotes;
	if (!response.ok || !quotes) {
		if (json.error && json.error.message) {
			throw new Error(json.error.message)
		} else {
			throw new Error("Getting quotes");
		}
	}

	return quotes.map((quote: any) => ({
		author: quote.author,
		text: quote.quote,
		credit: {
			url: "https://theysaidso.com",
			text: "theysaidso.com",
		}
	} as Quote));
}


export const getQuote: (category: string) => Promise<Quote[]>
	= makeKeyCache(fetchQuotes, 8 * 60);
