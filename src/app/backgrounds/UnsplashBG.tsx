import { fetchBinaryAsDataURL, getAPI } from "app/hooks";
import { type } from "app/utils/Schema";
import { BackgroundInfo } from "common/api/backgrounds";
import { defineMessages } from "react-intl";
import { ActualBackgroundProps, BackgroundProvider } from ".";
import { backgroundMessages } from "./messages";


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
		brightnessDark: type.unit_number(backgroundMessages.brightnessDark, "%", backgroundMessages.brightnessDarkHint),
		brightnessLight: type.unit_number(backgroundMessages.brightnessLight, "%", backgroundMessages.brightnessLightHint),
		blur: type.unit_number(backgroundMessages.blurRadius, "px"),
	},
	defaultValues: {
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

		const backgroundInfo = await getAPI<BackgroundInfo>("unsplash/",
			{ collection: values.collection });
		if (!backgroundInfo) {
			return {};
		}

		const dataURL = await fetchBinaryAsDataURL(backgroundInfo.url);

		const credits = {
			info: backgroundInfo,
		};

		return {
			...values,
			image: dataURL,
			color: backgroundInfo.color,
			credits: credits,
		};
	}
};
