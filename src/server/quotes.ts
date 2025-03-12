import { Quote, QuoteCategory } from "common/api/quotes";
import { makeKeyCache } from "./cache";


export async function getQuoteCategories(): Promise<QuoteCategory[]> {
	return [
		{
			"id": "inspire",
			"text": "Inspiring"
		},
	] as QuoteCategory[];
}


import quotes from "./data/quotes.json";


 
async function fetchQuotes(_category: string): Promise<Quote[]> {
	// TODO: use quote API

	// Random quote
	const quote = quotes[Math.floor(Math.random() * quotes.length)];

	return [
		{
			"text": quote.quote,
			"author": quote.author,
		}
	];
}


export const getQuote: (category: string) => Promise<Quote[]>
	= makeKeyCache(fetchQuotes, 8 * 60);
