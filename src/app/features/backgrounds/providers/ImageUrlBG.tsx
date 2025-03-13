import { schemaMessages } from "app/locale/common";
import { type } from "app/utils/Schema";
import { defineMessages } from "react-intl";
import { ActualBackgroundProps, BackgroundProvider } from "./common";
import { backgroundMessages } from "./messages";


const messages = defineMessages({
	title: {
		defaultMessage: "Image URL",
		description: "Image URL background mode",
	},

	description: {
		defaultMessage: "An image from a URL",
		description: "Backgroud mode description",
	},
});


interface ImageUrlBGProps {
	url: string;
	position: string;
	brightnessDark: number;
	blur: number;
}


export const ImageUrlBG : BackgroundProvider<ImageUrlBGProps> = {
	id: "ImageUrl",
	title: messages.title,
	description: messages.description,
	schema: {
		url: type.url(schemaMessages.imageUrl),
		position: type.string(backgroundMessages.position, backgroundMessages.positionHint),
		brightnessDark: type.unit_number(backgroundMessages.brightness, "%", undefined, 0, 150),
		blur: type.unit_number(backgroundMessages.blurRadius, "px", undefined, 0, 150),
	},
	defaultValues: {
		url: "",
		position: "bottom",
		brightnessDark: 100,
		blur: 0,
	},

	async get(values: ImageUrlBGProps): Promise<ActualBackgroundProps> {
		return {
			...values,
			image: values.url,
			color: "#336699",
		};
	}
};
