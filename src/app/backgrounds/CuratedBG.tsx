import { fetchBinaryAsDataURL, getAPI } from "app/hooks";
import { storage } from "app/Storage";
import { type } from "app/utils/Schema";
import { BackgroundInfo } from "common/api/backgrounds";
import { defineMessages } from "react-intl";
import { ActualBackgroundProps, BackgroundProvider, getCreditsFromBackgroundInfo } from ".";
import { backgroundMessages, CacheExpiry, cacheExpiryMessages } from "./messages";


const messages = defineMessages({
	title: {
		defaultMessage: "Curated",
		description: "Curated background mode",
	},

	description: {
		defaultMessage: "Random curated backgrounds",
		description: "Backgroud mode description",
	},
});

async function getBackgroundInfo(votes: Record<string, boolean>): Promise<(BackgroundInfo | undefined)> {
	const backgrounds = await getAPI<BackgroundInfo[]>("background/", {});
	if (backgrounds && backgrounds.length > 0) {
		for (let i = 0; i < backgrounds.length; i++) {
			if (votes[backgrounds[i].id] !== false) {
				return backgrounds[i];
			}
		}

		return backgrounds[0];
	} else {
		return undefined;
	}
}


interface CuratedBGProps {
	cacheExpiry: CacheExpiry,
	brightnessDark: number;
	brightnessLight: number;
	blur: number;
}


export const CuratedBG : BackgroundProvider<CuratedBGProps> = {
	id: "Curated",
	title: messages.title,
	description: messages.description,
	schema: {
		cacheExpiry: type.selectEnum(CacheExpiry, cacheExpiryMessages, backgroundMessages.cacheExpiry),
		brightnessDark: type.unit_number(backgroundMessages.brightnessDark, "%", backgroundMessages.brightnessDarkHint, 0, 150),
		brightnessLight: type.unit_number(backgroundMessages.brightnessLight, "%", backgroundMessages.brightnessLightHint, 0, 150),
		blur: type.unit_number(backgroundMessages.blurRadius, "px", undefined, 0),
	},
	defaultValues: {
		cacheExpiry: CacheExpiry.Minutes15,
		brightnessDark: 100,
		brightnessLight: 80,
		blur: 0,
	},
	enableCaching: true,

	async get(values: CuratedBGProps): Promise<ActualBackgroundProps> {
		const votes = await storage.get<Record<string, boolean>>("background_votes") ?? {};
		const backgroundInfo = await getBackgroundInfo(votes);
		if (!backgroundInfo) {
			return {};
		}

		const dataURL = await fetchBinaryAsDataURL(backgroundInfo.url);
		return {
			...values,
			image: dataURL,
			color: backgroundInfo.color,
			credits: getCreditsFromBackgroundInfo(backgroundInfo, true),
		};
	}
};
