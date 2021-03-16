import { storage } from "app/Storage";
import { useState } from "react";
import Schema, { type } from "../utils/Schema";
import { runPromise } from "./promises";


export enum BackgroundMode {
	Auto,
	Color,
	ImageUrl,
	Unsplash,
	// ImageUpload,
	// Reddit
}

export declare type BackgroundModeType = keyof typeof BackgroundMode;

export function getSchemaForMode(mode: BackgroundMode): Schema {
	switch (mode) {
	case BackgroundMode.Auto:
		return {};
	case BackgroundMode.Color:
		return {
			color: type.color("Color")
		};
	case BackgroundMode.ImageUrl:
		return {
			url: type.url("Image URL"),
			position: type.string("Position", "center, top, or bottom"),
		};
	case BackgroundMode.Unsplash:
		return {
			collection: type.string("Unsplash collection", "Collection ID. Found in the URL, example: 42576559"),
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
	case BackgroundMode.ImageUrl:
		return {
			url: "",
			position: "bottom",
		};
	case BackgroundMode.Unsplash:
		return {};
	}
}

export function getDescriptionForMode(mode: BackgroundMode): string {
	switch (mode) {
	case BackgroundMode.Auto:
		return "Random curated backgrounds";
	case BackgroundMode.Color:
		return "A single color";
	case BackgroundMode.ImageUrl:
		return "An image from a URL";
	case BackgroundMode.Unsplash:
		return "Random image from an Unsplash collection";
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

export function useBackground(dependents?: any[]): [(BackgroundConfig | null), (info: BackgroundConfig) => void] {
	const [value, setValue] = useState<BackgroundConfig | null>(null);
	runPromise<BackgroundConfig | null>(getBackgroundConfig, setValue, () => {}, dependents);

	function updateValue(val: BackgroundConfig) {
		const copy = { ...val };
		copy.values = Object.assign({}, getDefaultsForMode(copy.mode), copy.values);

		updateBackgroundConfig(copy);
		setValue(copy);
	}

	return [value, updateValue];
}
