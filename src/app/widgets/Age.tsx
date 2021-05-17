import Panel from 'app/components/Panel';
import Schema, { type } from 'app/utils/Schema';
import { Vector2 } from 'app/utils/Vector2';
import { WidgetProps } from 'app/Widget';
import React, { useEffect, useState } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';


const messages = defineMessages({
	title: {
		defaultMessage: "Age",
		description: "Age Widget",
	},

	description: {
		defaultMessage: "States your current age with way too much precision",
	},

	birth_date: {
		defaultMessage: "Birth date",
	},

	current_age: {
		defaultMessage: "You are <b>{age}</b>"
	},
});


interface AgeProps {
	birthDate: Date;
}

function calculateYearsSince(date: Date): number {
	const delta = new Date().getTime() - date.getTime();
	return delta / 365.25 / 1000 / (60 * 60 * 24);
}

export default function Age(widget: WidgetProps<AgeProps>) {
	const props = widget.props;

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
		<Panel {...widget.theme} className="vertical-middle">
			<FormattedMessage {...messages.current_age}
				values={{
					b: (chunks: any) => <strong>&nbsp;{chunks}&nbsp;</strong>,
					age: age.toFixed(7),
				}} />
		</Panel>);
}

Age.title = messages.title;
Age.description = messages.description;

Age.initialProps = {
	birthDate: new Date("1997-01-01")
};

Age.schema = {
	birthDate: type.date(messages.birth_date),
} as Schema;

Age.defaultSize = new Vector2(5, 1);
