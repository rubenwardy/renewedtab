export interface FeedInfo {
	type: FeedType;

	title: string;
	description?: string;

	url: string;
	htmlUrl?: string;

	numberOfArticles: number;
	numberOfImages: number;
}


export interface FeedSource {
	id: string;
	title: string;
	url: string;
	htmlUrl?: string;
}


export enum FeedType {
	Rss,
	Atom,
	Json,
}
