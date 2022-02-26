import { MyMessageDescriptor } from "app/locale/MyMessageDescriptor";
import Schema from "app/utils/Schema";
import { BackgroundInfo } from "common/api/backgrounds";


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


export enum GradientType {
	Vertical,
	Horizontal,
	Radial,
}


export interface GradientColor {
	color: string;
	stop: number;
}


export interface ActualBackgroundProps {
	image?: string;
	color?: string;
	gradientType?: GradientType;
	gradientColors?: GradientColor[];
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
	schema: Schema<T>;
	defaultValues: T;
	isBrowserOnly?: boolean;
	enableCaching?: boolean;
	formHint?: MyMessageDescriptor;
	get: (values: T) => Promise<ActualBackgroundProps>;
}
