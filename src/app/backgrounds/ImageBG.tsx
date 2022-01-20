import { FileInfo } from "app/components/forms/ImageUploadField";
import { schemaMessages } from "app/locale/common";
import { largeStorage } from "app/storage";
import { ImageHandle, type } from "app/utils/Schema";
import { defineMessages } from "react-intl";
import { ActualBackgroundProps, BackgroundProvider } from ".";
import { backgroundMessages } from "./messages";


const messages = defineMessages({
	title: {
		defaultMessage: "Image",
		description: "Image background mode",
	},

	description: {
		defaultMessage: "Use a custom image",
		description: "Backgroud mode description",
	},
});


interface ImageBGProps {
	image: (ImageHandle | undefined);
	brightnessDark: number;
	blur: number;
}


export const ImageBG : BackgroundProvider<ImageBGProps> = {
	id: "Image",
	title: messages.title,
	description: messages.description,
	schema: {
		image: type.image(schemaMessages.image, schemaMessages.imageHint),
		brightnessDark: type.unit_number(backgroundMessages.brightness, "%", undefined, 0, 150),
		blur: type.unit_number(backgroundMessages.blurRadius, "px", undefined, 0),
	},
	defaultValues: {
		image: undefined,
		brightnessDark: 100,
		blur: 0,
	},

	async get(values: ImageBGProps): Promise<ActualBackgroundProps> {
		const id: (string | undefined) =
			typeof values.image == "object" ? values.image?.key : values.image;
		const file = await largeStorage.get<FileInfo>(id ?? "");

		return {
			...values,
			image: file?.data ?? undefined,
		};
	}
};
