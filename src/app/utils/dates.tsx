export function toYear(date: Date, year: number): Date {
	const newDate = new Date(date);
	newDate.setFullYear(year);
	return newDate;
}

export function setMidnight(date: Date): Date {
	date.setHours(0);
	date.setMinutes(0);
	date.setSeconds(0);
	return date;
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
