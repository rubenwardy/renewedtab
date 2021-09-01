import { defineMessages } from "react-intl";


export const backgroundMessages = defineMessages({
	position: {
		defaultMessage: "Position",
		description: "Backgroud settings: form field label",
	},

	positionHint: {
		defaultMessage: "center, top, or bottom",
		description: "Backgroud settings: form field hint (Position)",
	},

	collection: {
		defaultMessage: "Unsplash collection",
		description: "Backgroud settings: form field label",
	},

	collectionHint: {
		defaultMessage: "Collection ID. Found in the URL, example: 42576559",
		description: "Backgroud settings: form field hint (Unsplash Collection)",
	},

	brightness: {
		defaultMessage: "Brightness",
		description: "Backgroud settings: form field label",
	},

	brightnessDark: {
		defaultMessage: "Brightness: Dark",
		description: "Backgroud settings: form field label",
	},

	brightnessDarkHint: {
		defaultMessage: "Change brightness of darker images",
		description: "Backgroud settings: form field label (Brightness: Dark)",
	},

	brightnessLight: {
		defaultMessage: "Brightness: Light",
		description: "Backgroud settings: form field label",
	},

	brightnessLightHint: {
		defaultMessage: "Change brightness of lighter images",
		description: "Backgroud settings: form field label (Brightness: Light)",
	},

	blurRadius: {
		defaultMessage: "Blur radius",
		description: "Backgroud settings: form field label",
	},

	cacheExpiry: {
		defaultMessage: "Show a new photo",
		description: "Backgroud settings: form field label (how often background images change)",
	},

	cacheExpiryHint: {
		defaultMessage: "Depending on your settings, the same photo may be chosen",
		description: "Background settings: form field hint (Show a new photo)",
	},
});


export enum CacheExpiry {
	Minutes15,
	Hourly,
	Daily,
}

export const cacheExpiryMessages = defineMessages({
	[CacheExpiry.Minutes15]: {
		defaultMessage: "Every 15 minutes",
		description: "Background expiry dropdown",
	},

	[CacheExpiry.Hourly]: {
		defaultMessage: "Every hour",
		description: "Background expiry dropdown",
	},

	[CacheExpiry.Daily]: {
		defaultMessage: "Every day",
		description: "Background expiry dropdown",
	},
});
