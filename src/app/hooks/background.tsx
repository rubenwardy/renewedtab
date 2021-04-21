import schemaMessages from "app/locale/common";
import { storage } from "app/Storage";
import { useState } from "react";
import { defineMessages, MessageDescriptor } from "react-intl";
import Schema, { type } from "../utils/Schema";
import { runPromise } from "./promises";


const messages = defineMessages({
	position: {
		defaultMessage: "Position",
	},

	positionHint: {
		defaultMessage: "center, top, or bottom",
	},

	collection: {
		defaultMessage: "Unsplash collection",
	},

	collectionHint: {
		defaultMessage: "Collection ID. Found in the URL, example: 42576559",
	},

	autoDescription: {
		defaultMessage: "Random curated backgrounds",
	},

	colorDescription: {
		defaultMessage: "A single color",
	},

	imageDescription: {
		defaultMessage: "Use a custom image",
	},

	imageUrlDescription: {
		defaultMessage: "An image from a URL",
	},

	unsplashDescription: {
		defaultMessage: "Random image from an Unsplash collection",
	},
});

export enum BackgroundMode {
	Auto,
	Color,
	Image,
	ImageUrl,
	Unsplash,
	// Reddit
}

export declare type BackgroundModeType = keyof typeof BackgroundMode;

export function getSchemaForMode(mode: BackgroundMode): Schema {
	switch (mode) {
	case BackgroundMode.Auto:
		return {};
	case BackgroundMode.Color:
		return {
			color: type.color(schemaMessages.color)
		};
	case BackgroundMode.Image:
		return {
			image: type.image(schemaMessages.image, schemaMessages.imageHint),
		};
	case BackgroundMode.ImageUrl:
		return {
			url: type.url(schemaMessages.imageUrl),
			position: type.string(messages.position, messages.positionHint),
		};
	case BackgroundMode.Unsplash:
		return {
			collection: type.string(messages.collection, messages.collectionHint),
		}
	}
}

export function getDefaultsForMode(mode: BackgroundMode): { [key: string]: any } {
	switch (mode) {
	case BackgroundMode.Auto:
		return {};
	case BackgroundMode.Color:
		return {
			color: "#336699"
		};
	case BackgroundMode.Image:
		return {};
	case BackgroundMode.ImageUrl:
		return {
			url: "",
			position: "bottom",
		};
	case BackgroundMode.Unsplash:
		return {};
	}
}

export function getDescriptionForMode(mode: BackgroundMode): MessageDescriptor {
	switch (mode) {
	case BackgroundMode.Auto:
		return messages.autoDescription;
	case BackgroundMode.Color:
		return messages.colorDescription;
	case BackgroundMode.ImageUrl:
		return messages.imageUrlDescription;
	case BackgroundMode.Image:
		return messages.imageDescription;
	case BackgroundMode.Unsplash:
		return messages.unsplashDescription;
	}
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
			values: {}
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
