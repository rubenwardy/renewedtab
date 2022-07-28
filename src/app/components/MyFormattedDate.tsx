import { setMidnight, ONE_DAY_MS } from "app/utils/dates";
import React from "react";
import { defineMessages, FormattedDate, FormattedMessage, useIntl } from "react-intl";


const messages = defineMessages({
	daysOfTheWeek: {
		defaultMessage: "Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday",
		description: "Days of the week, separated by commas",
	},
});


type FormattedDateParameters = Parameters<typeof FormattedDate>;
type FormattedDateParameters0 = FormattedDateParameters[0];
interface MyFormattedDateProps extends FormattedDateParameters0 {
	value: Date;
}


export default function MyFormattedDate(props: MyFormattedDateProps) {
	const intl = useIntl();
	const valueDayStart = setMidnight(props.value);
	const todayDayStart = setMidnight(new Date());
	const days = Math.round((valueDayStart.valueOf() - todayDayStart.valueOf()) / ONE_DAY_MS);

	if (days == 0) {
		return (<FormattedMessage defaultMessage="Today" />);
	} else if (days == 1) {
		return (<FormattedMessage defaultMessage="Tomorrow" />);
	} else if (days < 7) {
		const dayOfWeek = valueDayStart.getDay();
		const dayNames = intl.formatMessage(messages.daysOfTheWeek).split(",").map(x => x.trim());
		return (<>{dayNames[dayOfWeek]}</>);
	} else {
		return (<FormattedDate value={valueDayStart} />);
	}
}
