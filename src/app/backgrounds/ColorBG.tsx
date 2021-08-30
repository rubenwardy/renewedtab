import { schemaMessages } from "app/locale/common";
import { type } from "app/utils/Schema";
import { defineMessages } from "react-intl";
import { ActualBackgroundProps, BackgroundProvider } from ".";


const messages = defineMessages({
	title: {
		defaultMessage: "Color",
		description: "Color background mode",
	},

	description: {
		defaultMessage: "A single color",
		description: "Backgroud mode description",
	},
});


interface ColorBGProps {
	color: string;
}


export const ColorBG : BackgroundProvider<ColorBGProps> = {
	id: "Color",
	title: messages.title,
	description: messages.description,
	schema: {
		color: type.color(schemaMessages.color),
	},
	defaultValues: {
		color: "#336699"
	},

	async get(values: ColorBGProps): Promise<ActualBackgroundProps> {
		return {
			color: values.color,
		};
	}
};
