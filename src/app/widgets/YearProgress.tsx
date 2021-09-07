import Meter from 'app/components/Meter';
import Panel from 'app/components/Panel';
import { schemaMessages } from 'app/locale/common';
import Schema, { type } from 'app/utils/Schema';
import { Vector2 } from 'app/utils/Vector2';
import { themeMessages, WidgetProps, WidgetTheme } from 'app/Widget';
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



export default function YearProgress(widget: WidgetProps<any>) {
	const now = new Date();
	const start = new Date(now.getFullYear(), 0, 0);
	const diff = (now.valueOf() - start.valueOf()) +
		((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
	const oneDay = 1000 * 60 * 60 * 24;
	const dayOfYear = Math.floor(diff / oneDay);

	return (
		<Panel {...widget.theme} className="vertical-middle" invisClassName="vertical-middle">
			<Meter className="blur" color={widget.theme.color}
				value={dayOfYear} max={365} />
		</Panel>);
}

YearProgress.title = messages.title;
YearProgress.description = messages.description;

YearProgress.initialProps = {};
YearProgress.schema = {};

YearProgress.defaultSize = new Vector2(5, 1);

YearProgress.initialTheme = {
	showPanelBG: false,
	color: "",
} as WidgetTheme;

YearProgress.themeSchema = {
	showPanelBG: type.boolean(themeMessages.showPanelBG),
	color: type.color(schemaMessages.color),
} as Schema<WidgetTheme>;
