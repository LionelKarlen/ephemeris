import type Day from '$lib/types/Day';
import { DateTime } from 'luxon';

export const FORMAT_STRING = 'yyyy-MM-dd HH:mm:ss';

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

export function mockDays(month: number, year: number) {
	const days: Day[] = [];
	const start = DateTime.utc(year, month, 1);
	console.log(start);
	const end = start.endOf('month').startOf('day');
	console.log('end', end);
	for (let index = 1; index <= end.day; index++) {
		const dateTime = DateTime.utc(year, month, index);
		const timestamp = dateTime.toFormat(FORMAT_STRING);
		const obj: Day = {
			timestamp: timestamp
		};
		days.push(obj);
	}
	return days;
}
