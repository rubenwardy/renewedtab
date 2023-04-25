export interface Quote {
	author: string;
	text: string;
	credit?: { url: string, text: string };
}

export interface QuoteCategory {
	id: string;
	text: string;
}
