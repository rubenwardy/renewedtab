import Schema from "app/utils/Schema";
import { Vector2 } from "app/utils/Vector2";
import React from "react";

interface ClockProps {
	showSeconds: boolean;
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
		minute: "numeric"
	}

	return (<h1>{time.toLocaleTimeString(undefined, options)}</h1>);
}


Clock.initialProps = {};

Clock.schema = {} as Schema;

Clock.defaultSize = new Vector2(15, 2);
