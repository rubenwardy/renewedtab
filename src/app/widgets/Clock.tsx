import FitText from "app/components/FitText";
import Panel from "app/components/Panel";
import { schemaMessages } from "app/locale/common";
import { MyMessageDescriptor } from "app/locale/MyMessageDescriptor";
import { enumToString, enumToValue } from "app/utils/enum";
import { type } from "app/utils/Schema";
import { Vector2 } from "app/utils/Vector2";
import { WidgetProps, WidgetType } from "app/Widget";
import React from "react";
import { defineMessages, IntlShape, useIntl } from "react-intl";


enum DateStyle {
	None,
	Full,
	Long,
	Medium,
	Short,
	ISO,
}


const messages = defineMessages({
	title: {
		defaultMessage: "Clock",
		description: "Clock Widget",
	},

	description: {
		defaultMessage: "Shows the time",
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
});


const dateStyleMessages = defineMessages({
	[DateStyle.None]: {
		defaultMessage: "None",
		description: "Clock widget: date style type, not shown",
	},

	[DateStyle.Full]: {
		defaultMessage: "Extended ({example})",
		description: "Clock widget: date style type",
	},

	[DateStyle.Long]: {
		defaultMessage: "Standard ({example})",
		description: "Clock widget: date style type",
	},

	[DateStyle.Medium]: {
		defaultMessage: "Abbreviated ({example})",
		description: "Clock widget: date style type",
	},

	[DateStyle.Short]: {
		defaultMessage: "Numbers ({example})",
		description: "Clock widget: date style type",
	},

	[DateStyle.ISO]: {
		defaultMessage: "ISO ({example})",
		description: "Clock widget: date style type",
	},
});


function renderDate(intl: IntlShape, date: Date, dateStyle: DateStyle, timeZone: string | undefined): string {
	const dateStyleString = enumToString(DateStyle, dateStyle).toLowerCase() as any;

	if (dateStyle == DateStyle.ISO) {
		const month = (date.getMonth() + 1).toString().padStart(2, "0");
		const day = (date.getDate()).toString().padStart(2, "0");
		return `${date.getFullYear()}-${month}-${day}`;
	} else if (intl.locale == "en") {
		return new Intl.DateTimeFormat(undefined, {
			dateStyle: dateStyleString,
			timeZone,
		} as any).format(date);
	} else {
		return intl.formatDate(date, {
			dateStyle: dateStyleString,
			timeZone,
		});
	}
}


interface ClockProps {
	showSeconds: boolean;
	hour12: boolean;
	dateStyle: DateStyle;
	timeZone?: string;
}


function Clock(props: WidgetProps<ClockProps>) {
	const data = props.props;
	const [time, setTime] = React.useState<Date>(new Date());
	const intl = useIntl();

	React.useEffect(() => {
		const timer = setInterval(() => {
			setTime(new Date());
		}, 500);

		return () => {
			clearInterval(timer);
		};
	}, []);


	const timeZone = (data.timeZone != "" && data.timeZone != "auto") ? data.timeZone : undefined;
	const dateStyle = enumToValue(DateStyle, data.dateStyle);

	return (
		<Panel {...props.theme} scrolling={false}>
			<div className="row row-vertical h-100">
				<div className="col text-center">
					<FitText>
						{intl.formatTime(time, {
							hour: "numeric",
							minute: "numeric",
							second: data.showSeconds ? "numeric" : undefined,
							hourCycle: data.hour12 ? "h12" : "h23",
							timeZone,
						})}
					</FitText>
				</div>
				<div className="col-auto date">
					{dateStyle != undefined && dateStyle != DateStyle.None &&
								renderDate(intl, time, dateStyle, timeZone)}
				</div>
			</div>
		</Panel>);
}


const widget: WidgetType<ClockProps> = {
	Component: Clock,
	title: messages.title,
	description: messages.description,

	defaultSize: new Vector2(15, 2),

	initialProps: {
		showSeconds: false,
		hour12: false,
		dateStyle: DateStyle.None,
		timeZone: undefined,
	},

	initialTheme: {
		showPanelBG: false,
		textColor: "#ffffff",
	},
	themeSchema: {
		showPanelBG: type.boolean(schemaMessages.showPanelBG),
		textColor: type.color(schemaMessages.textColor),
	},

	async schema(widget, intl) {
		const timeZone = (widget.props.timeZone != "" && widget.props.timeZone != "auto")
			? widget.props.timeZone : undefined;

		const dateStyleMessagesWithExamples: Record<string, MyMessageDescriptor> = {};
		dateStyleMessagesWithExamples[DateStyle.None] = dateStyleMessages[DateStyle.None];
		Object.entries(dateStyleMessages)
			.filter(([key]) => parseInt(key) != DateStyle.None)
			.forEach(([key, value]) => {
				dateStyleMessagesWithExamples[key] = {
					...value,
					values: {
						example: renderDate(intl, new Date(), parseInt(key), timeZone),
					}
				} as MyMessageDescriptor;
			});

		return {
			timeZone: type.timeZone(schemaMessages.timeZone),
			showSeconds: type.boolean(messages.showSeconds),
			hour12: type.boolean(messages.hour12),
			dateStyle: type.selectEnum(DateStyle, dateStyleMessagesWithExamples, messages.showDate),
		};
	},

	async onLoaded(widget) {
		if (typeof widget.theme.textColor === "undefined") {
			widget.theme.textColor = "#ffffff";
		}
		if (typeof widget.props.dateStyle == "undefined") {
			widget.props.dateStyle = DateStyle.None;
		}
	},
};
export default widget;
