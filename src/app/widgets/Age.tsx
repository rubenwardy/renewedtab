import Panel from 'app/components/Panel';
import { calculateDecimalAge } from 'app/utils/dates';
import Schema, { type } from 'app/utils/Schema';
import { Vector2 } from 'app/utils/Vector2';
import { WidgetProps } from 'app/Widget';
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


export default function Age(widget: WidgetProps<AgeProps>) {
	const props = widget.props;

	const [age, setAge] = useState(calculateDecimalAge(props.birthDate));

	useEffect(() => {
		const timer = setInterval(() => {
			setAge(calculateDecimalAge(props.birthDate));
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
} as Schema<AgeProps>;

Age.defaultSize = new Vector2(5, 1);
