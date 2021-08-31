import { MyMessageDescriptor } from "app/locale/MyMessageDescriptor";
import Schema from "app/utils/Schema";
import { BackgroundInfo } from "common/api/backgrounds";
import { CuratedBG } from "./CuratedBG";
import { ColorBG } from "./ColorBG";
import { FeedBG } from "./FeedBG";
import { ImageBG } from "./ImageBG";
import { ImageUrlBG } from "./ImageUrlBG";
import { UnsplashBG } from "./UnsplashBG";


interface Link {
	text: string;
	url?: string;
}


export interface BackgroundCredit {
	info?: BackgroundInfo;
	title?: Link;
	author?: Link;
	site?: Link;
	enableVoting?: boolean;
}


export function getCreditsFromBackgroundInfo(info: BackgroundInfo, enableVoting?: boolean): BackgroundCredit {
	return {
		info, enableVoting,

		title: (info.title || info.links.photo) ? {
			text: info.title ?? "",
			url: info.links.photo
		} : undefined,

		author: info.author ? {
			text: info.author,
			url: info.links.author
		} : undefined,

		site: info.site ? {
			text: info.site,
			url: info.links.site
		} : undefined,
	};
}


export interface ActualBackgroundProps {
	image?: string;
	color?: string;
	brightnessDark?: number;
	brightnessLight?: number;
	blur?: number;
	credits?: BackgroundCredit;
	position?: string;
}

export interface BackgroundProvider<T> {
	id: string;
	title: MyMessageDescriptor;
	description: MyMessageDescriptor;
	schema: Schema;
	defaultValues: T;
	isBrowserOnly?: boolean;
	enableCaching?: boolean;
	get: (values: T) => Promise<ActualBackgroundProps>;
}


export const backgroundProviders: Record<string, BackgroundProvider<any>> = {
	"Curated": CuratedBG,
	"Color": ColorBG,
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
export function getSchemaForProvider(name: string): Schema {
	const schema = getBackgroundProvider(name)!.schema;

	const supportsBackdropFilter =
		CSS.supports("backdrop-filter: brightness(70%) contrast(110%) saturate(140%) blur(12px)");
	if (!supportsBackdropFilter) {
		delete schema.blur;
	}

	return schema;
}
