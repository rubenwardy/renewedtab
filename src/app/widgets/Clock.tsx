import Panel from "app/components/Panel";
import Schema, { type } from "app/utils/Schema";
import { Vector2 } from "app/utils/Vector2";
import { WidgetProps, WidgetTheme } from "app/Widget";
import React from "react";
import { defineMessages, FormattedTime } from "react-intl";


const messages = defineMessages({
	description: {
		defaultMessage: "Shows the time",
	},

	showSeconds: {
		defaultMessage: "Show seconds",
	},

	hour12: {
		defaultMessage: "12 hour clock",
	},
});

interface ClockProps {
	showSeconds: boolean;
	hour12: boolean;
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

	return (
		<Panel {...widget.theme}>
			<h1 className="text-shadow-soft middle-center">
				<FormattedTime
					value={time}
					hour="numeric" minute="numeric"
					second={props.showSeconds ? "numeric" : undefined}
					hourCycle={props.hour12 ? "h12" : "h23"} />
			</h1>
		</Panel>);
}


Clock.description = messages.description;

Clock.initialProps = {
	showSeconds: false,
	hour12: false
};

Clock.schema = {
	showSeconds: type.boolean(messages.showSeconds),
	hour12: type.boolean(messages.hour12),
} as Schema;

Clock.defaultSize = new Vector2(15, 2);

Clock.initialTheme = {
	showPanelBG: false,
} as WidgetTheme;
