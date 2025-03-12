import React, { useMemo } from "react";
import { defineMessages, FormattedMessage, FormattedTime, useIntl } from "react-intl";

import ErrorView from "app/components/ErrorView";
import Panel from "app/components/Panel";
import { useMultiCalendar } from "app/hooks";
import { miscMessages, schemaMessages } from "app/locale/common";
import Schema, { type } from "app/utils/Schema";
import { Vector2 } from "app/utils/Vector2";
import { WidgetProps, WidgetType } from "app/Widget";
import { setMidnight } from "app/utils/dates";
import { bindValuesToDescriptor, myFormatMessage } from "app/locale/MyMessageDescriptor";
import { useGlobalSearch } from "app/hooks/globalSearch";
import { queryMatchesAny } from "app/utils";
import MyFormattedDate from "app/components/MyFormattedDate";


const messages = defineMessages({
	title: {
		defaultMessage: "Calendar Schedule",
		description: "CalendarSchedule Widget",
	},

	description: {
		defaultMessage: "Show upcoming events from an iCal (.ics) URL (Such as Google Calendar)",
		description: "CalendarSchedule widget: description",
	},

	calendars: {
		defaultMessage: "Calendars",
		description: "CalendarSchedule widget: form field label",
	},

	urlHint: {
		defaultMessage: "URL to an iCal (.ics) file for a calendar",
		description: "CalendarSchedule widget: form field hint (Calendar URL)",
	},

	limitToDays: {
		defaultMessage: "Max number of days",
		description: "CalendarSchedule widget: form field label",
	},

	limitToDaysHint: {
		defaultMessage: "How far into the future to look for events. Set to 1 to only show today's events, 2 for today and tomorrow, etc.",
		description: "CalendarSchedule widget: form field hint (max number of days)",
	},

	editHint: {
		defaultMessage: "Please read <a>the tutorial</a>. You can use any cloud calendar that supports iCal, including Google Calendar and Outlook.",
		description: "CalendarSchedule widget: edit hint",
	},

	experimental: {
		defaultMessage: "<b>This widget is experimental</b>: There may be issues with events appearing, and it may cause the page to freeze.",
		description: "CalendarSchedule widget disclaimer",
	}
});


interface CalendarScheduleProps {
	calendars: { url: string }[];
	limitToDays: number;
}


/* eslint-disable react-hooks/rules-of-hooks */
function CalendarSchedule(widget: WidgetProps<CalendarScheduleProps>) {
	const intl = useIntl();
	const { query } = useGlobalSearch();
	const [pair, error] = useMultiCalendar(
		widget.props.calendars.map(x => x.url), widget.props.limitToDays,
		[widget.props.calendars, widget.props.limitToDays]);
	if (!pair) {
		// eslint-disable-next-line react-hooks/exhaustive-deps
		useMemo(() => {}, [[], ""]);
		 
		return (<ErrorView error={error} loading={true} />);
	}

	const [events, errors] = pair;

	const filteredEvents = useMemo(() => {
		if (!query) {
			return events;
		}

		return events.filter(event => queryMatchesAny(query, event.summary));
	}, [events, query]);

	let lastDay = new Date(0);
	return (
		<Panel {...widget.theme} flush={true}>
			<ul className="links">
				{errors.map(({ url, error }, i) => (
					<li key={`err-${i}`} className="section error">
						<FormattedMessage
							defaultMessage="Failed to load {source}: {error}"
							description="Feed error message"
							values={{
								source: url,
								error: error.messageDescriptor ? myFormatMessage(intl, error.messageDescriptor) : error.message,
							}} />
					</li>
				))}

				{events.length == 0 && !query && (
					<li key="no-results" className="text-only mt-2">
						<FormattedMessage
							defaultMessage="No events"
							description="CalendarSchedule: no events" />
					</li>)}

				{filteredEvents.length == 0 && query && (
					<li key="no-results" className="text-only mt-2">
						<FormattedMessage {...miscMessages.noResults} />
					</li>)}

				{filteredEvents.flatMap(event => {
					const inner = (
						<div className="row">
							{!event.isAllDay && (
								<div className="col-3 text-muted">
									<FormattedTime value={event.start} />
								</div>)}

							<div className="col">{event.summary}</div>
						</div>);

					const key = `${event.uid}-${event.start.valueOf()}-${event.end.valueOf()}`;

					const ret = [(
						<li key={key} className={event.url ? undefined : "text-only"}>
							{event.url ? (<a href={event.url}>{inner}</a>) : inner}
						</li>)];

					const day = new Date(event.start);
					setMidnight(day);
					if (lastDay.valueOf() != day.valueOf()) {
						lastDay = day;
						ret.unshift((
							<li key={day.toISOString()} className="section">
								<span className="title">
									<MyFormattedDate value={day} />
								</span>
							</li>
						))
					}

					return ret;
				})}
			</ul>
		</Panel>);
}


const calendarSchema: Schema<{ url: string }> = {
	url: type.urlFeed(schemaMessages.url, messages.urlHint),
};


const widget: WidgetType<CalendarScheduleProps> = {
	Component: CalendarSchedule,
	title: messages.title,
	description: messages.description,
	defaultSize: new Vector2(5, 4),
	editHint: [
		bindValuesToDescriptor(messages.editHint, {
			a: (chunk: any) => (<a href="https://renewedtab.com/help/calendar/">{chunk}</a>),
		}),
		bindValuesToDescriptor(messages.experimental, {
			b: (chunk: any) => (<strong>{chunk}</strong>),
		}),
	],
	isBrowserOnly: true,
	initialProps: {
		calendars: [],
		limitToDays: 7,
	},
	schema: {
		calendars: type.unorderedArray(calendarSchema, messages.calendars),
		limitToDays: type.number(messages.limitToDays, messages.limitToDaysHint, 1, 28),
	},
};
export default widget;
