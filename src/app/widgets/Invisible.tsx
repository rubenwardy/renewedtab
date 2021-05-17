import Schema from 'app/utils/Schema';
import { Vector2 } from 'app/utils/Vector2';
import { WidgetTheme } from 'app/Widget';
import { defineMessages } from 'react-intl';


const messages = defineMessages({
	title: {
		defaultMessage: "Invisible",
		description: "Invisible Widget",
	},

	description: {
		defaultMessage: "Shows nothing, useful for layouting purposes",
	},
})


export default function Invisible(): (JSX.Element | null) {
	return null;
}


Invisible.title = messages.title;
Invisible.description = messages.description;

Invisible.initialProps = {};

Invisible.schema = {} as Schema;

Invisible.defaultSize = new Vector2(5, 5);

Invisible.initialTheme = {
	showPanelBG: false,
} as WidgetTheme;

Invisible.themeSchema = {} as Schema;
