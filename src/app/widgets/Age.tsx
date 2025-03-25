import Panel from 'app/components/Panel';
import { calculateDecimalAge } from 'app/utils/dates';
import { type } from 'app/utils/Schema';
import { Vector2 } from 'app/utils/Vector2';
import { WidgetProps, WidgetType } from 'app/Widget';
import React, { useEffect, useState } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';


const messages = defineMessages({
	title: {
		defaultMessage: "Age",
		description: "Age widget",
	},

	description: {
		defaultMessage: "States your current age with way too much precision",
		description: "Age widget description",
	},

	birth_date: {
		defaultMessage: "Birth date",
		description: "Age widget: form field label",
	},

	current_age: {
		defaultMessage: "You are <b>{age}</b>",
		description: "Age widget text",
	},
});


interface AgeProps {
	birthDate: Date;
}


function Age(props: WidgetProps<AgeProps>) {
	const data = props.props;

	const [age, setAge] = useState(calculateDecimalAge(data.birthDate));

	useEffect(() => {
		const timer = setInterval(() => {
			setAge(calculateDecimalAge(data.birthDate));
		}, 500);

		return () => {
			clearInterval(timer);
		};
	}, [data.birthDate]);

	return (
		<Panel {...props.theme} className="vertical-middle" invisClassName="vertical-middle">
			<FormattedMessage {...messages.current_age}
				values={{
					b: (chunks: any) => <strong key={Math.random()}>&nbsp;{chunks}&nbsp;</strong>,
					age: age.toFixed(7),
				}} />
		</Panel>);
}


const widget: WidgetType<AgeProps> = {
	Component: Age,
	title: messages.title,
	description: messages.description,
	defaultSize: new Vector2(5, 1),
	initialProps: {
		birthDate: new Date("1997-01-01"),
	},
	schema: {
		birthDate: type.date(messages.birth_date),
	},
};
export default widget;
