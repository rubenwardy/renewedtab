import { fetchFeed, getAPI } from "app/hooks";
import { schemaMessages } from "app/locale/common";
import { AutocompleteItem, type } from "app/utils/Schema";
import { defineMessages } from "react-intl";
import { ActualBackgroundProps, BackgroundCredit, BackgroundProvider } from ".";
import { backgroundMessages, CacheExpiry, cacheExpiryMessages } from "./messages";


const messages = defineMessages({
	title: {
		defaultMessage: "Feed",
		description: "Unsplash background mode",
	},

	description: {
		defaultMessage: "Random image from an Atom or RSS feed",
		description: "Backgroud mode description",
	},

	randomiseFrom: {
		defaultMessage: "Limit images",
		description: "Feed background mode: form field label",
	},

	randomiseFromHint: {
		defaultMessage: "Controls how many of the most recent images to randomly choose from. Setting this to 1 will always choose the latest image",
		description: "Feed background mode: form field hint (Limit images)",
	},
});


interface FeedBGProps {
	feedURL: string;
	randomiseFrom: number;
	cacheExpiry: CacheExpiry,
	position: string;
	brightnessDark: number;
	blur: number;
}


export const FeedBG : BackgroundProvider<FeedBGProps> = {
	id: "Feed",
	title: messages.title,
	description: messages.description,
	schema: {
		feedURL: type.urlFeed(schemaMessages.url, schemaMessages.rssUrlHint,
			() => getAPI<AutocompleteItem[]>("feeds/background/", {})),
		randomiseFrom: type.number(messages.randomiseFrom, messages.randomiseFromHint, 1),
		cacheExpiry: type.selectEnum(CacheExpiry, cacheExpiryMessages,
			backgroundMessages.cacheExpiry, backgroundMessages.cacheExpiryHint),
		position: type.string(backgroundMessages.position, backgroundMessages.positionHint),
		brightnessDark: type.unit_number(backgroundMessages.brightness, "%", undefined, 0,  150),
		blur: type.unit_number(backgroundMessages.blurRadius, "px", undefined, 0),
	},
	defaultValues: {
		feedURL: "https://www.nasa.gov/rss/dyn/lg_image_of_the_day.rss",
		randomiseFrom: 1,
		cacheExpiry: CacheExpiry.Hourly,
		position: "center",
		brightnessDark: 100,
		blur: 0,
	},
	enableCaching: true,

	async get(values: FeedBGProps): Promise<ActualBackgroundProps> {
		if (values.feedURL == "") {
			return {};
		}

		const feed = await fetchFeed(values.feedURL);

		const articles = feed.articles
			.filter(art => art.image)
			.slice(0, values.randomiseFrom ?? 1);
		if (articles.length == 0) {
			return {};
		}

		const article = articles[Math.floor(Math.random() * articles.length)];

		const credits: BackgroundCredit = {
			title: {
				text: article.title ?? "",
				url: article.link,
			},
		};

		return {
			...values,
			credits: credits,
			image: article.image!,
		};
	}
};
