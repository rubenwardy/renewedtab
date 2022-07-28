import type ICAL from "ical.js";
import { isMidnight } from "./dates";

import IcalExpander from "ical-expander";


export interface CalendarEvent {
	uid: string;
	start: Date;
	end: Date;
	summary: string;
	description: string;
	url?: string;
	isAllDay: boolean;
}


function isAllDay(start: Date, end: Date): boolean {
	return start.getDate() == end.getDate() - 1 && start.getFullYear() == end.getFullYear() &&
		isMidnight(start) && isMidnight(end);
}


function convertEvent(event: ICAL.Event): CalendarEvent {
	const urls = event.description.match(/\bhttps?:\/\/\S+/gi);
	return {
		uid: event.uid,
		start: event.startDate.toJSDate(),
		end: event.endDate.toJSDate(),
		summary: event.summary,
		description: event.description,
		url: urls?.[0] ?? undefined,
		isAllDay: isAllDay(event.startDate.toJSDate(), event.endDate.toJSDate()),
	};
}


/**
 * Get all events, including recurring events,
 * between `start` and `end` inclusive.
 *
 * @param text
 * @param start Start date time, inclusive
 * @param end End date time, inclusive
 * @returns
 */
export function getEventsBetweenDates(text: string, start: Date, end: Date): CalendarEvent[] {
	const icalExpander = new IcalExpander({ ics: text, maxIterations: 0 });
	const events = icalExpander.between(start, end);

	const ret: CalendarEvent[] = events.events.map(convertEvent);

	return ret.concat(events.occurrences.map(o => {
		const template = convertEvent(o.item);
		const duration = template.end.valueOf() - template.start.valueOf();
		return {
			...template,
			start: o.startDate.toJSDate(),
			end: new Date(o.startDate.toJSDate().valueOf() + duration),
			summary: o.item.summary,
		};
	})).sort((a, b) => a.start.valueOf() - b.start.valueOf());
}
