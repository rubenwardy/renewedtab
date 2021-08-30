import { fetchFeed, getAPI } from "app/hooks";
import { schemaMessages } from "app/locale/common";
import { AutocompleteList, type } from "app/utils/Schema";
import { defineMessages } from "react-intl";
import { ActualBackgroundProps, BackgroundProvider } from ".";
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
		description: "Feed background mode: randomise checkbox",
	},

	randomiseFromHint: {
		defaultMessage: "Controls how many of the most recent images to randomly choose from. Setting this to 1 will always choose the latest image",
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
		feedURL: type.urlPerm(schemaMessages.url, schemaMessages.rssUrlHint,
			() => getAPI<AutocompleteList[]>("webcomics/", {})),
		randomiseFrom: type.number(messages.randomiseFrom, messages.randomiseFromHint),
		cacheExpiry: type.selectEnum(CacheExpiry, cacheExpiryMessages,
			backgroundMessages.cacheExpiry, backgroundMessages.cacheExpiryHint),
		position: type.string(backgroundMessages.position, backgroundMessages.positionHint),
		brightnessDark: type.unit_number(backgroundMessages.brightness, "%"),
		blur: type.unit_number(backgroundMessages.blurRadius, "px"),
	},
	defaultValues: {
		feedURL: "https://www.nasa.gov/rss/dyn/lg_image_of_the_day.rss",
		randomiseFrom: 1,
		cacheExpiry: CacheExpiry.Minutes15,
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

		const images = feed.articles
			.map(art => art.image)
			.filter(image => image)
			.slice(0, values.randomiseFrom ?? 1);
		if (images.length == 0) {
			return {};
		}

		const image = images[Math.floor(Math.random() * images.length)];
		return {
			...values,
			image: image,
		};
	}
};
