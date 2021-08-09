import { schemaMessages } from "app/locale/common";
import { storage } from "app/Storage";
import { useState } from "react";
import { defineMessages, MessageDescriptor } from "react-intl";
import Schema, { type } from "../utils/Schema";
import { runPromise } from "./promises";


const messages = defineMessages({
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
});


export enum BackgroundMode {
	Auto,
	Color,
	Image,
	ImageUrl,
	Unsplash,
}


const bgTitles = defineMessages({
	[BackgroundMode.Auto]: {
		defaultMessage: "Auto",
		description: "Auto background mode",
	},

	[BackgroundMode.Color]: {
		defaultMessage: "Color",
		description: "Color background mode",
	},

	[BackgroundMode.Image]: {
		defaultMessage: "Image",
		description: "Image background mode",
	},

	[BackgroundMode.ImageUrl]: {
		defaultMessage: "Image URL",
		description: "Image URL background mode",
	},

	[BackgroundMode.Unsplash]: {
		defaultMessage: "Unsplash",
		description: "Unsplash background mode",
	},
});


const bgDescriptions = defineMessages({
	[BackgroundMode.Auto]: {
		defaultMessage: "Random curated backgrounds",
		description: "Backgroud mode description",
	},

	[BackgroundMode.Color]: {
		defaultMessage: "A single color",
		description: "Backgroud mode description",
	},

	[BackgroundMode.Image]: {
		defaultMessage: "Use a custom image",
		description: "Backgroud mode description",
	},

	[BackgroundMode.ImageUrl]: {
		defaultMessage: "An image from a URL",
		description: "Backgroud mode description",
	},

	[BackgroundMode.Unsplash]: {
		defaultMessage: "Random image from an Unsplash collection",
		description: "Backgroud mode description",
	},
});

export declare type BackgroundModeType = keyof typeof BackgroundMode;

function getSchemaForModeImpl(mode: BackgroundMode): Schema {
	switch (mode) {
	case BackgroundMode.Auto:
		return {
			brightness: type.unit_number(schemaMessages.brightness, "%"),
			blur: type.unit_number(schemaMessages.blurRadius, "px"),
		};
	case BackgroundMode.Color:
		return {
			color: type.color(schemaMessages.color),
		};
	case BackgroundMode.Image:
		return {
			image: type.image(schemaMessages.image, schemaMessages.imageHint),
			brightness: type.unit_number(schemaMessages.brightness, "%"),
			blur: type.unit_number(schemaMessages.blurRadius, "px"),
		};
	case BackgroundMode.ImageUrl:
		return {
			url: type.url(schemaMessages.imageUrl),
			position: type.string(messages.position, messages.positionHint),
			brightness: type.unit_number(schemaMessages.brightness, "%"),
			blur: type.unit_number(schemaMessages.blurRadius, "px"),
		};
	case BackgroundMode.Unsplash:
		return {
			collection: type.string(messages.collection, messages.collectionHint),
			brightness: type.unit_number(schemaMessages.brightness, "%"),
			blur: type.unit_number(schemaMessages.blurRadius, "px"),
		}
	}
}


export function getSchemaForMode(mode: BackgroundMode): Schema {
	const schema = getSchemaForModeImpl(mode);

	const supportsBackdropFilter =
		CSS.supports("backdrop-filter: brightness(70%) contrast(110%) saturate(140%) blur(12px)");
	if (!supportsBackdropFilter) {
		delete schema.blur;
	}

	return schema;
}


export function getDefaultsForMode(mode: BackgroundMode): { [key: string]: any } {
	switch (mode) {
	case BackgroundMode.Auto:
		return {
			brightness: 100,
			blur: 0,
		};
	case BackgroundMode.Color:
		return {
			color: "#336699"
		};
	case BackgroundMode.Image:
		return {
			brightness: 100,
			blur: 0,
		};
	case BackgroundMode.ImageUrl:
		return {
			url: "",
			position: "bottom",
			brightness: 100,
			blur: 0,
		};
	case BackgroundMode.Unsplash:
		return {
			brightness: 100,
			blur: 0,
		};
	}
}


export function getTitleForMode(mode: BackgroundMode): MessageDescriptor {
	return bgTitles[mode];
}


export function getDescriptionForMode(mode: BackgroundMode): MessageDescriptor {
	return bgDescriptions[mode];
}

export interface BackgroundConfig {
	mode: BackgroundMode;
	values: { [key: string]: any };
}

export async function getBackgroundConfig(): Promise<BackgroundConfig> {
	const info : BackgroundConfig | null = await storage.get("background");
	if (!info) {
		return {
			mode: BackgroundMode.Auto,
			values: getDefaultsForMode(BackgroundMode.Auto),
		}
	}

	return info;
}

export function updateBackgroundConfig(info: BackgroundConfig) {
	storage.set("background", info);
}

export function useBackground(): [(BackgroundConfig | null), (info: BackgroundConfig) => void] {
	const [value, setValue] = useState<BackgroundConfig | null>(null);
	runPromise<BackgroundConfig | null>(
		getBackgroundConfig, setValue, () => {}, []);

	function updateValue(val: BackgroundConfig) {
		const copy = { ...val };
		copy.values = Object.assign({}, getDefaultsForMode(copy.mode), copy.values);

		updateBackgroundConfig(copy);
		setValue(copy);
	}

	return [value, updateValue];
}
