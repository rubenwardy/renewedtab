import Schema, { type } from "app/utils/Schema";
import { Vector2 } from "app/utils/Vector2";
import { WidgetRaw } from "app/WidgetManager";
import React from "react";

interface ClockProps {
	showSeconds: boolean;
	hour12: boolean;
}

export default function Clock(props: ClockProps) {
	const [time, setTime] = React.useState<Date>(new Date());

	React.useEffect(() => {
		const timer = setInterval(() => {
			setTime(new Date());
		}, 500);

		return () => {
			clearInterval(timer);
		};
	});

	const options: Intl.DateTimeFormatOptions = props.showSeconds ? {} : {
		hour: "numeric",
		minute: "numeric",
		hour12: props.hour12,
	}

	return (<h1 className="text-shadow-soft">{time.toLocaleTimeString(undefined, options)}</h1>);
}


Clock.description = "Shows the time";

Clock.initialProps = {
	showSeconds: false,
	hour12: false
};

Clock.schema = {
	showSeconds: type.boolean("Show seconds"),
	hour12: type.boolean("12 hour clock"),
} as Schema;

Clock.defaultSize = new Vector2(15, 2);
