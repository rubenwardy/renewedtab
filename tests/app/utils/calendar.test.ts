import { expect } from "chai";
import fs from "fs";
import { getEventsBetweenDates } from "app/utils/calendar";


function getCalendar(name: string): string {
	return fs.readFileSync("tests/data/calendars/" + name).toString();
}


describe("calendar", () => {
	const tests = {
		"minimal_out_of_range": {
			"file": "minimal.ics",
			"start": "2020-06-20",
			"end": "2020-06-31",
			"events": [],
		},
		"minimal": {
			"file": "minimal.ics",
			"start": "2012-06-20",
			"end": "2012-06-31",
			"events": [
				{
					"uid": "dn4vrfmfn5p05roahsopg57h48@google.com",
					"start": "2012-06-30T13:00:00.000Z",
					"end": "2012-06-30T14:00:00.000Z",
					"summary": "Really long event name thing",
					"description": "",
					"isAllDay": false,
					"url": undefined,
				}
			],
		},
		"daily_recur": {
			"file": "daily_recur.ics",
			"start": "2022-07-01",
			"end": "2022-07-03",
			"events": [
				{
					"uid": "tgh9qho17b07pk2n2ji3gluans@google.com",
					"start": "2022-07-01T12:00:00.000Z",
					"end": "2022-07-01T13:00:00.000Z",
					"summary": "Every day recurring",
					"description": "",
					"isAllDay": false,
					"url": undefined,
				},
				{
					"uid": "tgh9qho17b07pk2n2ji3gluans@google.com",
					"start": "2022-07-02T12:00:00.000Z",
					"end": "2022-07-02T13:00:00.000Z",
					"summary": "Every day recurring",
					"description": "",
					"isAllDay": false,
					"url": undefined,
				}
			],
		},
		"recur_exception": {
			"file": "recur_exception.ics",
			"start": "2022-07-18",
			"end": "2022-08-24",
			"events": [
				{
					"uid": "3001r3coub9dqfptlt9bb2g26n@google.com",
					"start": "2022-07-19T12:45:00.000Z",
					"end": "2022-07-19T14:00:00.000Z",
					"summary": "My Event",
					"description": "",
					"isAllDay": false,
					"url": undefined,
				},
				{
					"uid": "3001r3coub9dqfptlt9bb2g26n@google.com",
					"start": "2022-07-26T12:45:00.000Z",
					"end": "2022-07-26T14:00:00.000Z",
					"summary": "My Event",
					"description": "",
					"isAllDay": false,
					"url": undefined,
				},
				{
					"uid": "3001r3coub9dqfptlt9bb2g26n@google.com",
					"start": "2022-08-02T12:45:00.000Z",
					"end": "2022-08-02T14:00:00.000Z",
					"summary": "My Event 2",
					"description": "",
					"isAllDay": false,
					"url": undefined,
				},
				{
					"uid": "3001r3coub9dqfptlt9bb2g26n@google.com",
					"start": "2022-08-09T12:45:00.000Z",
					"end": "2022-08-09T14:00:00.000Z",
					"summary": "My Event",
					"description": "",
					"isAllDay": false,
					"url": undefined,
				},
				{
					"uid": "3001r3coub9dqfptlt9bb2g26n_R20220816T124500@google.com",
					"start": "2022-08-16T12:45:00.000Z",
					"end": "2022-08-16T14:00:00.000Z",
					"summary": "My Event 3",
					"description": "",
					"isAllDay": false,
					"url": undefined,
				},
				{
					"uid": "3001r3coub9dqfptlt9bb2g26n_R20220816T124500@google.com",
					"start": "2022-08-23T12:45:00.000Z",
					"end": "2022-08-23T14:00:00.000Z",
					"summary": "My Event 3",
					"description": "",
					"isAllDay": false,
					"url": undefined,
				},
			],
		},
	};

	Object.entries(tests).forEach(([title, test]) => {
		const expected = test.events.map(event => ({
			...event,
			start: new Date(event.start),
			end: new Date(event.end),
		}));

		it(title, () => {
			const events = getEventsBetweenDates(getCalendar(test.file),
				new Date(test.start), new Date(test.end));

			expect(events).to.deep.eq(expected);
		});
	});
});
