import Schema, { type } from 'app/utils/Schema';
import { Vector2 } from 'app/utils/Vector2';
import React, { useEffect, useState } from 'react';

interface AgeProps {
	birthDate: Date;
}

function calculateYearsSince(date: Date): number {
	const delta = (new Date().getTime() - date.getTime());
	return delta / 365.25 / 1000 / (60 * 60 * 24);
}

export default function Age(props: AgeProps) {
	const [age, setAge] = useState(calculateYearsSince(props.birthDate));

	useEffect(() => {
		const timer = setInterval(() => {
			setAge(calculateYearsSince(props.birthDate));
		}, 500);

		return () => {
			clearInterval(timer);
		};
	}, [props.birthDate]);

	return (
		<div className="panel">
			You are <strong>{age.toFixed(7)}</strong>
		</div>);
}


Age.description = "States your current age with way too much precision";

Age.initialProps = {
	birthDate: new Date("1997-01-01")
};

Age.schema = {
	birthDate: type.date("Birth date"),
} as Schema;

Age.defaultSize = new Vector2(5, 1);
