import type Demonstrator from '$lib/types/Demonstrator';
import { pb } from './pocketbase';
import type { EngagementDay } from '$lib/types/Day';
import { DateTime } from 'luxon';
import { FORMAT_STRING } from './mockdays';
import { createEvents, type ReturnObject } from 'ics';
import type ICSEvent from '$lib/types/ICSEvent';

/**
 * Generate ics Events for every Engagement the Demonstrator has in a given year
 *
 * @param demonstrator Demonstrator for whom the calendar is being generated
 * @param year Year of the calendar
 */
export async function generateCalendar(demonstrator: Demonstrator, year: number) {
	// Get all engagements in given year, where the demonstrator is assigned
	const start = DateTime.utc(year, 1, 1);
	const end = start.endOf('year').startOf('day').plus({ day: 1 });
	const days: EngagementDay[] = await pb.collection('days').getFullList({
		filter: `timestamp>="${start.toFormat(FORMAT_STRING)}" && timestamp < "${end.toFormat(
			FORMAT_STRING
		)}" && assigned ~ "${demonstrator.id}"`
	});

	// Loop days and generate list of events
	const events: ICSEvent[] = [];
	for (const day of days) {
		const timestamp = DateTime.fromFormat(day.timestamp, FORMAT_STRING);
		const event: ICSEvent = {
			title: `Sternwarte`,
			duration: { hours: 1 },
			start: [timestamp.year, timestamp.month, timestamp.day],
			startInputType: 'utc'
		};
		events.push(event);
	}

	// Download file
	const filename = `Sternwarte ${demonstrator.name} ${year}.ics`;
	await handleDownload(createEvents(events), filename);
}

/**
 * Generate and download ics calendar File
 *
 * @param events List of events
 * @param filename Name of the generated File
 */
async function handleDownload(events: ReturnObject, filename: string) {
	// Create the file
	const file = await new Promise<File>((resolve) => {
		resolve(new File([events.value ? events.value : ''], filename, { type: 'plain/text' }));
	});
	const url = URL.createObjectURL(file);

	// trying to assign the file URL to a window could cause cross-site
	// issues so this is a workaround using HTML5
	const anchor = document.createElement('a');
	anchor.href = url;
	anchor.download = filename;

	document.body.appendChild(anchor);
	anchor.click();
	document.body.removeChild(anchor);

	URL.revokeObjectURL(url);
}
