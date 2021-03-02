import React from 'react';
import { Widget } from '../Widget';

interface AgeProps {
	birthDate: Date;
}

function calculateYearsSince(date: Date): number {
	const delta = (new Date().getTime() - date.getTime());
	return delta / 365.25 / 1000 / (60 * 60 * 24);
}

export function Age(props: AgeProps) {
	const [age, setAge] = React.useState(calculateYearsSince(props.birthDate));

	React.useEffect(() => {
		const timer = setInterval(() => {
			setAge(calculateYearsSince(props.birthDate));
		}, 500);

		return () => {
			clearInterval(timer);
		};
	}, [props.birthDate]);

	return (
		<Widget type="Age" props={props}>
			You are <strong>{age.toFixed(7)}</strong>
		</Widget>);
}
