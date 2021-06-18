import Panel from "app/components/Panel";
import { schemaMessages } from "app/locale/common";
import Schema, { type } from "app/utils/Schema";
import { Vector2 } from "app/utils/Vector2";
import { themeMessages, Widget, WidgetProps, WidgetTheme } from "app/Widget";
import React from "react";
import { defineMessages, FormattedDate, FormattedTime } from "react-intl";


enum DateStyle {
	None,
	Full,
	Long,
	Medium,
	Short,
}


const messages = defineMessages({
	title: {
		defaultMessage: "Clock",
		description: "Clock Widget",
	},

	description: {
		defaultMessage: "Shows the time",
	},

	editHint: {
		defaultMessage: "The time is based on your system's timezone. If the time is wrong, make sure that you have the timezone set correctly in your computer and browser settings.",
		description: "Clock widget: edit hint",
	},

	showSeconds: {
		defaultMessage: "Show seconds",
	},

	hour12: {
		defaultMessage: "12 hour clock",
	},

	showDate: {
		defaultMessage: "Date style",
		description: "Clock widget: date style form field label",
	},

	[DateStyle.None]: {
		defaultMessage: "None",
		description: "Clock widget: date style type, not shown",
	},

	[DateStyle.Full]: {
		defaultMessage: "Full",
		description: "Clock widget: date style type",
	},

	[DateStyle.Long]: {
		defaultMessage: "Long",
		description: "Clock widget: date style type",
	},

	[DateStyle.Medium]: {
		defaultMessage: "Medium",
		description: "Clock widget: date style type",
	},

	[DateStyle.Short]: {
		defaultMessage: "Short",
		description: "Clock widget: date style type",
	},
});


interface ClockProps {
	showSeconds: boolean;
	hour12: boolean;
	dateStyle: DateStyle;
}

export default function Clock(widget: WidgetProps<ClockProps>) {
	const props = widget.props;
	const [time, setTime] = React.useState<Date>(new Date());

	React.useEffect(() => {
		const timer = setInterval(() => {
			setTime(new Date());
		}, 500);

		return () => {
			clearInterval(timer);
		};
	});

	const dateStyle = typeof props.dateStyle == "string"
			? props.dateStyle : DateStyle[props.dateStyle];

	return (
		<Panel {...widget.theme} scrolling={false}>
			<div className="middle-center">
				<div>
					<span className="time">
						<FormattedTime
							value={time}
							hour="numeric" minute="numeric"
							second={props.showSeconds ? "numeric" : undefined}
							hourCycle={props.hour12 ? "h12" : "h23"} />
					</span>
					<span className="date">
						{props.dateStyle != undefined && props.dateStyle != DateStyle.None &&
							<FormattedDate
								value={time}
								dateStyle={dateStyle.toLowerCase() as any} />}
					</span>
				</div>
			</div>
		</Panel>);
}

Clock.title = messages.title;
Clock.description = messages.description;
Clock.editHint = messages.editHint;

Clock.initialProps = {
	showSeconds: false,
	hour12: false,
	dateStyle: DateStyle.None,
};

Clock.schema = {
	showSeconds: type.boolean(messages.showSeconds),
	hour12: type.boolean(messages.hour12),
	dateStyle: type.selectEnum(DateStyle, messages, messages.showDate),
} as Schema;

Clock.defaultSize = new Vector2(15, 2);

Clock.initialTheme = {
	showPanelBG: false,
	textColor: "#ffffff",
} as WidgetTheme;

Clock.themeSchema = {
	showPanelBG: type.boolean(themeMessages.showPanelBG),
	textColor: type.color(schemaMessages.textColor),
} as Schema;


Clock.onLoaded = async (widget: Widget<ClockProps>) => {
	if (typeof widget.theme.textColor === "undefined") {
		widget.theme.textColor = "#ffffff";
	}
	if (typeof widget.props.dateStyle == "undefined") {
		widget.props.dateStyle = DateStyle.None;
	}
};
