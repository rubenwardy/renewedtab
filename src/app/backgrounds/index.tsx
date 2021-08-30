import { MyMessageDescriptor } from "app/locale/MyMessageDescriptor";
import Schema from "app/utils/Schema";
import { BackgroundInfo } from "common/api/backgrounds";
import { AutoBG } from "./AutoBG";
import { ColorBG } from "./Color";
import { ImageBG } from "./Image";
import { ImageUrlBG } from "./ImageUrlBG";
import { UnsplashBG } from "./Unsplash";


export interface CreditProps {
	info: BackgroundInfo;
	setIsHovered?: (value: boolean) => void;

	isPositive?: boolean;
	onLike?: (info: BackgroundInfo) => void;
	onBlock?: (info: BackgroundInfo) => void;
}

export interface ActualBackgroundProps {
	image?: string;
	color?: string;
	brightnessDark?: number;
	brightnessLight?: number;
	blur?: number;
	credits?: CreditProps;
	position?: string;
}

export interface BackgroundProvider<T> {
	id: string;
	title: MyMessageDescriptor;
	description: MyMessageDescriptor;
	schema: Schema;
	defaultValues: T;

	get: (values: T) => Promise<ActualBackgroundProps>;
}


export const backgroundProviders: Record<string, BackgroundProvider<any>> = {
	"Auto": AutoBG,
	"Color": ColorBG,
	"Image": ImageBG,
	"ImageUrl": ImageUrlBG,
	"Unsplash": UnsplashBG,
};


/**
 * ID number to string mapping, to allow for migration
 * of legacy settings.
 */
const legacyAliases = [
	"Auto",
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