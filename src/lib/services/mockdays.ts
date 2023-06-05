import type Day from '$lib/types/Day';
import { DateTime } from 'luxon';

export const FORMAT_STRING = 'yyyy-MM-dd HH:mm:ss.SSS';

export const MONTHS = [
	'january',
	'february',
	'march',
	'april',
	'may',
	'june',
	'july',
	'august',
	'september',
	'october',
	'november',
	'december'
];

export function formatLegible(dateTime: DateTime): string {
	//TODO: Update locale based on defined locale
	return dateTime.toFormat('cccc, dd. LLL yyyy', { locale: 'de-ch' });
}

export function mockDays(month: number, year: number, realDays: string[]) {
	const days: Day[] = [];
	const start = DateTime.utc(year, month, 1);
	const end = start.endOf('month').startOf('day');
	for (let index = 1; index <= end.day; index++) {
		const dateTime = DateTime.utc(year, month, index);
		const timestamp = dateTime.toFormat(FORMAT_STRING);
		if (realDays.includes(timestamp)) {
			continue;
		}
		const obj: Day = {
			timestamp: timestamp
		};
		days.push(obj);
	}
	return days;
}

export function isDayWednesday(day: DateTime) {
	return day.weekday == 3;
}

export function isDayFirstSunday(day: DateTime) {
	return day.weekday == 7 && day < day.startOf('month').plus({ weeks: 1 });
}
