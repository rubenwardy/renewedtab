import Meter from 'app/components/Meter';
import Panel from 'app/components/Panel';
import { schemaMessages } from 'app/locale/common';
import { type } from 'app/utils/Schema';
import { Vector2 } from 'app/utils/Vector2';
import { WidgetProps, WidgetType } from 'app/Widget';
import React from 'react';
import { defineMessages } from 'react-intl';


const messages = defineMessages({
	title: {
		defaultMessage: "Year Progress",
		description: "Year Progress widget",
	},

	description: {
		defaultMessage: "Shows the progress through the year as a progress bar",
		description: "Age widget description",
	},
});


function YearProgress(props: WidgetProps<any>) {
	const now = new Date();
	const start = new Date(now.getFullYear(), 0, 0);
	const diff = (now.valueOf() - start.valueOf()) +
		((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
	const oneDay = 1000 * 60 * 60 * 24;
	const dayOfYear = Math.floor(diff / oneDay);

	return (
		<Panel {...props.theme} className="vertical-middle" invisClassName="vertical-middle">
			<Meter className="blur" color={props.theme.color}
				value={dayOfYear} max={365} />
		</Panel>);
}


const widget: WidgetType<Record<string, never>> = {
	Component: YearProgress,
	title: messages.title,
	description: messages.description,
	defaultSize: new Vector2(5, 1),
	initialProps: {},
	schema: {},

	initialTheme: {
		showPanelBG: false,
		color: "",
	},
	themeSchema: {
		showPanelBG: type.boolean(schemaMessages.showPanelBG),
		color: type.color(schemaMessages.color),
	}
};
export default widget;
