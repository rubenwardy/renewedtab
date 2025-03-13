import { calculateLastAndNextBirthday, setMidnight, toYear } from "app/utils/dates";
import { expect } from "chai";

const parseDate = (val: string) => setMidnight(new Date(val));


describe("toYear", () => {
	const cases = {
		standard: {
			input: "2021-03-15",
			year: 2015,
			expected: "2015-03-15",
		},

		leapYear1: {
			input: "2020-02-29",
			year: 2021,
			expected: "2021-03-01",
		},

		leapYear2: {
			input: "2020-02-29",
			year: 2019,
			expected: "2019-03-01",
		},

		leapYear3: {
			input: "2020-02-29",
			year: 2016,
			expected: "2016-02-29",
		},
	}

	Object.entries(cases).forEach(([key, value]) => {
		it(key, () => {
			const output = toYear(parseDate(value.input), value.year);
			expect(output).to.deep.eq(parseDate(value.expected));
		});
	});
});


describe("calculateLastAndNextBirthday", () => {
	const cases = {
		before: {
			dob: "2001-08-15",
			now: "2021-08-14",
			last: "2020-08-15",
			next: "2021-08-15",
		},

		on: {
			dob: "2001-08-15",
			now: "2021-08-15",
			last: "2021-08-15",
			next: "2022-08-15",
		},

		after: {
			dob: "2001-08-15",
			now: "2021-08-16",
			last: "2021-08-15",
			next: "2022-08-15",
		},

		leapYears: {
			dob: "2016-02-29",
			now: "2019-03-03",
			last: "2019-03-01",
			next: "2020-02-29",
		},
	}


	Object.entries(cases).forEach(([key, value]) => {
		it(key, () => {
			const [last, next] = calculateLastAndNextBirthday(
						parseDate(value.now), parseDate(value.dob))
			expect(last).to.deep.eq(parseDate(value.last));
			expect(next).to.deep.eq(parseDate(value.next));
		});
	});
});
