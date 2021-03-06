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


Clock.defaultProps = {}

Clock.defaultSize = { x: 15, y: 2 };
