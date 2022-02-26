import { schemaMessages } from "app/locale/common";
import Schema, { type } from "app/utils/Schema";
import { defineMessages, MessageDescriptor } from "react-intl";
import { ActualBackgroundProps, BackgroundProvider, GradientColor, GradientType } from "./common";


const messages = defineMessages({
	title: {
		defaultMessage: "Gradient",
		description: "Gradient background mode",
	},

	description: {
		defaultMessage: "A gradient of colors",
		description: "Backgroud mode description",
	},

	gradientType: {
		defaultMessage: "Gradient Type",
		description: "Form field label",
	},

	stop: {
		defaultMessage: "Stop",
		description: "Form field label. Gradient stop (%)",
	},

	stopHint: {
		defaultMessage: "From 0-100%, position of color on gradient",
		description: "Form field hint (Stop)",
	},

	firefoxNote: {
		defaultMessage: "Note: Firefox may show artifacts such as lines on gradient backgrounds. This isn't something that we can fix.",
		description: "Gradient background disclaimer on Firefox",
	},
});


const gradientTypeMessages = defineMessages({
	[GradientType.Vertical]: {
		defaultMessage: "Vertical",
		description: "Form field option, vertical gradient",
	},
	[GradientType.Horizontal]: {
		defaultMessage: "Horizontal",
		description: "Form field option, horizontal gradient",
	},
	[GradientType.Radial]: {
		defaultMessage: "Radial",
		description: "Form field option, radial gradient",
	},
}) as Record<GradientType, MessageDescriptor>;


const gradientColorSchema: Schema<GradientColor> = {
	color: type.color(schemaMessages.color),
	stop: type.unit_number(messages.stop, "%", messages.stopHint, 0, 100),
};


interface GradientBGProps {
	gradientType: GradientType;
	gradientColors: GradientColor[];
}


export const GradientBG : BackgroundProvider<GradientBGProps> = {
	id: "Gradient",
	title: messages.title,
	description: messages.description,
	formHint: messages.firefoxNote,
	schema: {
		gradientType: type.selectEnum(GradientType, gradientTypeMessages, messages.gradientType),
		gradientColors: type.array(gradientColorSchema, schemaMessages.colors),
	},
	defaultValues: {
		gradientType: GradientType.Vertical,
		gradientColors: [
			{
				color: "#009ce6",
				stop: 0,
			},
			{
				color: "#093167",
				stop: 100,
			},
		]
	},

	async get(values: GradientBGProps): Promise<ActualBackgroundProps> {
		return {
			color: values.gradientColors[0]?.color,
			gradientType: values.gradientType,
			gradientColors: values.gradientColors,
		};
	}
};
