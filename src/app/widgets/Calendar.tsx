import Panel from "app/components/Panel";
import { schemaMessages } from "app/locale/common";
import { type } from "app/utils/Schema";
import { Vector2 } from "app/utils/Vector2";
import { WidgetProps, WidgetType } from "app/Widget";
import React, { useEffect, useState } from "react";
import { defineMessages, useIntl } from "react-intl";


const messages = defineMessages({
	title: {
		defaultMessage: "Calendar",
		description: "Calendar widget",
	},

	description: {
		defaultMessage: "Shows a monthly calendar with the current date highlighted",
		description: "Calendar widget description",
	},

	showWeekdays: {
		defaultMessage: "Show weekday headers",
		description: "Calendar widget: show weekday headers option",
	},

	sunday: {
		defaultMessage: "Sun",
		description: "Calendar widget: Sunday abbreviation",
	},

	monday: {
		defaultMessage: "Mon",
		description: "Calendar widget: Monday abbreviation",
	},

	tuesday: {
		defaultMessage: "Tue",
		description: "Calendar widget: Tuesday abbreviation",
	},

	wednesday: {
		defaultMessage: "Wed",
		description: "Calendar widget: Wednesday abbreviation",
	},

	thursday: {
		defaultMessage: "Thu",
		description: "Calendar widget: Thursday abbreviation",
	},

	friday: {
		defaultMessage: "Fri",
		description: "Calendar widget: Friday abbreviation",
	},

	saturday: {
		defaultMessage: "Sat",
		description: "Calendar widget: Saturday abbreviation",
	},
});


interface CalendarProps {
	showWeekdays: boolean;
}


function Calendar(props: WidgetProps<CalendarProps>) {
	const { showWeekdays } = props.props;
	const [today, setToday] = useState<Date>(new Date());
	const intl = useIntl();

	// Update date at midnight
	useEffect(() => {
		const now = new Date();
		const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
		const msUntilMidnight = tomorrow.getTime() - now.getTime();

		const timeout = setTimeout(() => {
			setToday(new Date());
		}, msUntilMidnight);

		return () => clearTimeout(timeout);
	}, [today]);

	const currentYear = today.getFullYear();
	const currentMonth = today.getMonth();
	const currentDate = today.getDate();

	// Get first day of the month (0 = Sunday, 1 = Monday, etc.)
	const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
	// Get number of days in the month
	const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

	// Weekday abbreviations starting from Sunday
	const weekdays = [
		messages.sunday,
		messages.monday,
		messages.tuesday,
		messages.wednesday,
		messages.thursday,
		messages.friday,
		messages.saturday,
	];

	// Generate calendar days
	const days: (number | null)[] = [];

	// Add empty cells for days before the first day of the month
	for (let i = 0; i < firstDayOfMonth; i++) {
		days.push(null);
	}

	// Add days of the month
	for (let i = 1; i <= daysInMonth; i++) {
		days.push(i);
	}

	// Format month and year for header
	const monthYear = intl.formatDate(today, {
		year: "numeric",
		month: "long",
	});

	return (
		<Panel {...props.theme} scrolling={false}>
			<div className="calendar-widget">
				<div className="calendar-header">
					{monthYear}
				</div>
				{showWeekdays && (
					<div className="calendar-weekdays">
						{weekdays.map((day, index) => (
							<div key={index} className="calendar-weekday">
								{intl.formatMessage(day)}
							</div>
						))}
					</div>
				)}
				<div className="calendar-days">
					{days.map((day, index) => (
						<div
							key={index}
							className={`calendar-day ${day === currentDate ? "today" : ""} ${day === null ? "empty" : ""}`}>
							{day !== null && (
								<span className="day-number">{day}</span>
							)}
						</div>
					))}
				</div>
			</div>
		</Panel>
	);
}


const widget: WidgetType<CalendarProps> = {
	Component: Calendar,
	title: messages.title,
	description: messages.description,

	defaultSize: new Vector2(4, 4),

	initialProps: {
		showWeekdays: true,
	},

	schema: {
		showWeekdays: type.boolean(messages.showWeekdays),
	},

	initialTheme: {
		showPanelBG: true,
	},
};

export default widget;
