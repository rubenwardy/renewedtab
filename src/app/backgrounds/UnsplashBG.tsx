import { fetchBinaryAsDataURL, fetchAPI } from "app/hooks";
import { type } from "app/utils/Schema";
import { BackgroundInfo } from "common/api/backgrounds";
import { defineMessages } from "react-intl";
import { ActualBackgroundProps, BackgroundProvider, getCreditsFromBackgroundInfo } from "./common";
import { backgroundMessages, CacheExpiry, cacheExpiryMessages } from "./messages";


const messages = defineMessages({
	title: {
		defaultMessage: "Unsplash",
		description: "Unsplash background mode",
	},

	description: {
		defaultMessage: "Random image from an Unsplash collection",
		description: "Backgroud mode description",
	},
});


interface UnsplashBGProps {
	cacheExpiry: CacheExpiry,
	collection: string;
	brightnessDark: number;
	brightnessLight: number;
	blur: number;
}


export const UnsplashBG : BackgroundProvider<UnsplashBGProps> = {
	id: "Unsplash",
	title: messages.title,
	description: messages.description,
	schema: {
		collection: type.string(backgroundMessages.collection, backgroundMessages.collectionHint),
		cacheExpiry: type.selectEnum(CacheExpiry, cacheExpiryMessages, backgroundMessages.cacheExpiry),
		brightnessDark: type.unit_number(backgroundMessages.brightnessDark, "%", backgroundMessages.brightnessDarkHint, 0, 150),
		brightnessLight: type.unit_number(backgroundMessages.brightnessLight, "%", backgroundMessages.brightnessLightHint, 0, 150),
		blur: type.unit_number(backgroundMessages.blurRadius, "px", undefined, 0),
	},
	defaultValues: {
		cacheExpiry: CacheExpiry.Hourly,
		collection: "",
		brightnessDark: 100,
		brightnessLight: 80,
		blur: 0,
	},

	enableCaching: true,

	async get(values: UnsplashBGProps): Promise<ActualBackgroundProps> {
		if (values.collection == "") {
			return {};
		}

		const backgroundInfo = await fetchAPI<BackgroundInfo>("unsplash/",
			{ collection: values.collection });
		if (!backgroundInfo) {
			return {};
		}

		const dataURL = await fetchBinaryAsDataURL(backgroundInfo.url);
		return {
			...values,
			image: dataURL,
			color: backgroundInfo.color,
			credits: getCreditsFromBackgroundInfo(backgroundInfo),
		};
	}
};
