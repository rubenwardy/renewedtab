import Panel from 'app/components/Panel';
import { schemaMessages } from 'app/locale/common';
import Color from 'app/utils/Color';
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

	const style: any = {};
	if (widget.theme.color && Color.fromString(widget.theme.color)) {
		style["--color-primary-light"] = widget.theme.color;
	}

	return (
		<Panel {...widget.theme} className="vertical-middle" invisClassName="vertical-middle">
			<meter value={dayOfYear} min={0} max={365} className="w-100 blur" style={style} />
		</Panel>);
}

YearProgress.title = messages.title;
YearProgress.description = messages.description;

YearProgress.initialProps = {};
YearProgress.schema = {} as Schema;

YearProgress.defaultSize = new Vector2(5, 1);

YearProgress.initialTheme = {
	showPanelBG: false,
	color: "",
} as WidgetTheme;

YearProgress.themeSchema = {
	showPanelBG: type.boolean(themeMessages.showPanelBG),
	color: type.color(schemaMessages.color),
} as Schema;
