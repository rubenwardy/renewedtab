export const ONE_HOUR_MS = 60*60*1000;
export const ONE_DAY_MS = 24*ONE_HOUR_MS;
export const ONE_WEEK_MS = 7*ONE_DAY_MS;


export function toYear(date: Date, year: number): Date {
	const newDate = new Date(date);
	newDate.setFullYear(year);
	return newDate;
}


export function setEndOfDay(date: Date): Date {
	date.setHours(23);
	date.setMinutes(59);
	date.setSeconds(59);
	return date;
}


export function setMidnight(date: Date): Date {
	date.setHours(0);
	date.setMinutes(0);
	date.setSeconds(0);
	return date;
}

export function isMidnight(date: Date): boolean {
	return date.getHours() == 0 && date.getMinutes() == 0 &&
		date.getSeconds() == 0;
}


/**
 * Returns the dates of their last birthday and their next birthday
 *
 * @param dateOfBirth
 * @returns [lastBirthday, nextBirthday]
 */
export function calculateLastAndNextBirthday(now: Date, dateOfBirth: Date): [Date, Date] {
	const thisYear = toYear(dateOfBirth, now.getFullYear());
	setMidnight(thisYear);

	if (thisYear.getTime() <= now.getTime()) {
		// Birthday has passed this year
		const nextYear = toYear(dateOfBirth, now.getFullYear() + 1);
		setMidnight(nextYear);
		return [thisYear, nextYear];
	} else {
		// Birthday is still to come
		const lastYear = toYear(dateOfBirth, now.getFullYear() - 1);
		setMidnight(lastYear);
		return [lastYear, thisYear];
	}
}


export function calculateDecimalAge(dateOfBirth: Date): number {
	const now = new Date();
	const [lastBirthday, nextBirthday] =
			calculateLastAndNextBirthday(now, dateOfBirth);

	// Calculate integer age
	const delta = lastBirthday.getTime() - dateOfBirth.getTime();
	const integerPart = Math.round(delta / 365.25 / 1000 / (60 * 60 * 24));

	// Calculate fraction of `now` between lastBirthday and nextBirthday
	const fractionalPart =
		(now.getTime() - lastBirthday.getTime())
		/
		(nextBirthday.getTime() - lastBirthday.getTime());

	return integerPart + fractionalPart;
}


export function parseDate(v: (string | undefined)): (Date | undefined) {
	if (v == undefined) {
		return undefined;
	}

	const ret = new Date(v);
	return !isNaN(ret.getTime()) ? ret : undefined;
}
