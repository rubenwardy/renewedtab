import { getAPI } from "app/hooks";
import { storage } from "app/Storage";
import { type } from "app/utils/Schema";
import { BackgroundInfo } from "common/api/backgrounds";
import { defineMessages } from "react-intl";
import { ActualBackgroundProps, BackgroundProvider } from ".";
import { backgroundMessages } from "./messages";


const messages = defineMessages({
	title: {
		defaultMessage: "Auto",
		description: "Auto background mode",
	},

	description: {
		defaultMessage: "Random curated backgrounds",
		description: "Backgroud mode description",
	},
});

async function getBackground(votes: Record<string, boolean>): Promise<(BackgroundInfo | undefined)> {
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


interface AutoBGProps {
	brightnessDark: number;
	brightnessLight: number;
	blur: number;
}


export const AutoBG : BackgroundProvider<AutoBGProps> = {
	id: "Auto",
	title: messages.title,
	description: messages.description,
	schema: {
		brightnessDark: type.unit_number(backgroundMessages.brightnessDark, "%", backgroundMessages.brightnessDarkHint),
		brightnessLight: type.unit_number(backgroundMessages.brightnessLight, "%", backgroundMessages.brightnessLightHint),
		blur: type.unit_number(backgroundMessages.blurRadius, "px"),
	},
	defaultValues: {
		brightnessDark: 100,
		brightnessLight: 80,
		blur: 0,
	},

	async get(values: AutoBGProps): Promise<ActualBackgroundProps> {
		const votes = await storage.get<Record<string, boolean>>("background_votes") ?? {};
		const background = await getBackground(votes);
		if (!background) {
			return {};
		}

		const credits = {
			info: background,
			isPositive: votes[background.id]
		}

		return {
			...values,
			image: background.url,
			color: background.color,
			credits: credits,
		};
	}
};
