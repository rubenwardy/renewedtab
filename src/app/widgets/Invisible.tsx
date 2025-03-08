import { JSX } from "react";
import { defineMessages } from 'react-intl';
import { Vector2 } from 'app/utils/Vector2';
import { WidgetType } from 'app/Widget';


const messages = defineMessages({
	title: {
		defaultMessage: "Invisible",
		description: "Invisible Widget",
	},

	description: {
		defaultMessage: "Shows nothing, useful for layouting purposes",
		description: "Invisible widget description",
	},
})


function Invisible(): (JSX.Element | null) {
	return null;
}


const widget: WidgetType<Record<string, never>> = {
	Component: Invisible,
	title: messages.title,
	description: messages.description,
	themeSchema: {},
	defaultSize: new Vector2(5, 5),
	initialProps: {},
	schema: {},
	initialTheme: {
		showPanelBG: false,
	},
};
export default widget;
