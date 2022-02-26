import Schema from "app/utils/Schema";


import { CuratedBG } from "./CuratedBG";
import { ColorBG } from "./ColorBG";
import { FeedBG } from "./FeedBG";
import { ImageBG } from "./ImageBG";
import { ImageUrlBG } from "./ImageUrlBG";
import { UnsplashBG } from "./UnsplashBG";
import { GradientBG } from "./GradientBG";
import { BackgroundProvider } from "./common";


export const backgroundProviders: Record<string, BackgroundProvider<any>> = {
	"Curated": CuratedBG,
	"Color": ColorBG,
	"Gradient": GradientBG,
	"Image": ImageBG,
	"ImageUrl": ImageUrlBG,
	"Unsplash": UnsplashBG,
	"Feed": FeedBG,
};


/**
 * ID number to string mapping, to allow for migration
 * of legacy settings.
 */
const legacyAliases = [
	"Curated",
	"Color",
	"Image",
	"ImageUrl",
	"Unsplash"
];


/**
 * @param name Background provider name or legacy ID
 * @returns BackgroundProvider
 */
export function getBackgroundProvider<T>(name: (string | number)): (BackgroundProvider<T> | undefined) {
	if (typeof name == "number") {
		const alias = legacyAliases[name];
		return alias ? backgroundProviders[alias] : undefined;
	} else {
		return backgroundProviders[name];
	}
}


/**
 * @param name Background provider name
 * @returns Schema
 */
export function getSchemaForProvider<T>(name: string): Schema<T> {
	const schema = getBackgroundProvider<T & { blur?: unknown }>(name)!.schema;

	const supportsBackdropFilter =
		CSS.supports("backdrop-filter: brightness(70%) contrast(110%) saturate(140%) blur(12px)");
	if (!supportsBackdropFilter && "blur" in schema) {
		delete schema.blur;
	}

	return schema;
}
