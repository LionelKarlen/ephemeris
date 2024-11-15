import type ArchiveCache from '$lib/types/ArchiveCache';
import type { EngagementDay } from '$lib/types/Day';
import type Day from '$lib/types/Day';
import { DateTime } from 'luxon';
import { pb } from './pocketbase';
import { locale } from '$lib/services/i18n';

export const FORMAT_STRING = 'yyyy-MM-dd HH:mm:ss.SSS';

export function formatLegible(dateTime: DateTime): string {
	return dateTime.toLocaleString(DateTime.DATE_HUGE, { locale: locale.get() });
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

export async function archiveYear(year: number) {
	const archiveCache = await generateArchiveCache(year);
	await pb.collection('archiveCaches').create(archiveCache);
}

export async function generateArchiveCache(year: number): Promise<ArchiveCache> {
	// Get all days in year
	const start = DateTime.utc(year, 1, 1);
	const end = start.endOf('year').startOf('day').plus({ day: 1 });
	const days: EngagementDay[] = await pb.collection('days').getFullList({
		filter: `timestamp>="${start.toFormat(FORMAT_STRING)}" && timestamp < "${end.toFormat(
			FORMAT_STRING
		)}"`
	});

	let visitors = 0;

	// Iterate days to add up visitors, engagementTypes, and visitorTypeks
	// We use a map here, because the engagementTypes are user-defined
	const engagementTypesMap: Map<string, number> = new Map();
	const visitorTypesMap: Map<string, number> = new Map();
	for (const day of days) {
		visitors += day.visitorNumber ? day.visitorNumber : 0;

		if (day.engagementType) {
			const value = engagementTypesMap.get(day.engagementType) ?? 0;
			engagementTypesMap.set(day.engagementType, value + 1);
		}

		if (day.visitorType) {
			const value = visitorTypesMap.get(day.visitorType) ?? 0;
			visitorTypesMap.set(day.visitorType, value + 1);
		}
	}
	console.log(engagementTypesMap);

	return {
		year: year,
		numEngagements: days.length,
		totalVisitors: visitors,
		engagementTypes: Object.fromEntries(engagementTypesMap),
		visitorTypes: Object.fromEntries(visitorTypesMap)
	};
}

export async function updateArchiveCache(archiveCache: ArchiveCache) {
	const bodyArchiveCache = await generateArchiveCache(archiveCache.year);
	if (archiveCache.id) {
		await pb.collection('archiveCaches').update(archiveCache.id, bodyArchiveCache);
		const obj: ArchiveCache = {
			id: archiveCache.id,
			year: bodyArchiveCache.year,
			numEngagements: bodyArchiveCache.numEngagements,
			totalVisitors: bodyArchiveCache.totalVisitors,
			engagementTypes: bodyArchiveCache.engagementTypes,
			visitorTypes: bodyArchiveCache.visitorTypes
		};
		return obj;
	}
}
