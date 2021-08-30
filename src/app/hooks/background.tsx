import { getBackgroundProvider } from "app/backgrounds";
import { storage } from "app/Storage";
import { useState } from "react";
import { runPromise } from ".";

export interface BackgroundConfig {
	mode: string;
	values: { [key: string]: any };
}

export async function getBackgroundConfig(): Promise<BackgroundConfig> {
	const info : BackgroundConfig | null = await storage.get("background");
	if (info) {
		const provider = getBackgroundProvider<any>(info.mode);
		if (provider) {
			info.mode = provider.id;
			info.values = {
				...provider.defaultValues,
				...info.values
			};
			return info;
		}
	}

	const provider = getBackgroundProvider<any>("Auto");
	return {
		mode: "Auto",
		values: provider!.defaultValues,
	}
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
		const provider = getBackgroundProvider<any>(copy.mode);
		copy.values = {
			...provider!.defaultValues,
			...copy.values
		};

		updateBackgroundConfig(copy);
		setValue(copy);
	}

	return [value, updateValue];
}
