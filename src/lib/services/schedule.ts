import type GenerationDemonstator from '$lib/types/GenerationDemonstrator';
import { DateTime, Interval } from 'luxon';
import { FORMAT_STRING, isDayFirstSunday, isDayWednesday } from './mockdays';
import { pb } from './pocketbase';
import type Day from '$lib/types/Day';
import type { EngagementDay } from '$lib/types/Day';
import type Warning from '$lib/types/Warning';

/**
 * Generate an assignment schedule for the given year, based on Demonstrator availability and visit count balancing
 *
 * @param year year in format YYYY
 *
 * @returns `Error` if there was an error. Note: Missing assignments are not considered Errors in this sense.
 */
export default async function generateSchedule(year: number): Promise<Error | void> {
	try {
		// Get Days
		const days = await getEngagementsInYear(year);

		// Get Demonstrators
		const demonstrators = await getDemonstrators();

		// Save the ids of those days, where no demonstrator was assigned
		const warnings: Warning[] = [];

		// Save the demonstrator who visited the last engagement. Since there is no -1th engagement, lastDemonstrator could be undefined.
		let lastDemonstrator: GenerationDemonstator | undefined;

		// Loop days and assign
		for (const day of days) {
			const demonstrator = determineDemonstratorForDay(day, demonstrators, lastDemonstrator);
			updateDeficit(demonstrator, demonstrators);
			if (demonstrator) {
				//TODO: Decide what to do with already assigned users
				// As it stands, we simply add the newly assigned user to the list
				// This could be changed so that previous assignments get ignored or overwritten
				const assigned = day.assigned ? day.assigned : [];
				day.assigned = [...assigned, demonstrator.id];
				lastDemonstrator = demonstrator;
				uploadDay(day);
			} else {
				if (day.id) {
					warnings.push({ day: day.id, timestamp: day.timestamp });
				}
			}
		}

		uploadWarnings(warnings);

		console.log(days);
		console.log(warnings);
		console.log(demonstrators);
	} catch (error) {
		return Error(error as string);
	}
}

/**
 * Get all EngagementDays in given year, either from the database or, if no entry exists, by mocking them
 *
 * @param year given year in format YYYY
 * @returns `Promise<EngagementDay[]>`
 */
async function getEngagementsInYear(year: number): Promise<EngagementDay[]> {
	const start = DateTime.utc(year, 1, 1);
	const end = start.endOf('year').startOf('day').plus({ days: 1 }); // Interval is exclusive end, so we add a day
	const tmpMockDays = Interval.fromDateTimes(start, end)
		.splitBy({ days: 1 }) // Get every day in the year
		.filter((v) => {
			const date = v.start;
			if (date) {
				// Filter by engagement days
				if (isDayFirstSunday(date) || isDayWednesday(date)) {
					return date;
				}
			}
		});

	// Create a Day for every Day Interval and store it to Day[]
	const mockDays: Day[] = tmpMockDays.map((v) => {
		if (v.start) {
			const obj: Day = {
				timestamp: v.start.toFormat(FORMAT_STRING)
			};
			return obj;
		}
	}) as Day[];

	// Get all database days in year
	const realDays: EngagementDay[] = await pb.collection('days').getFullList({
		filter: `timestamp>="${start.toFormat(FORMAT_STRING)}" && timestamp < "${end.toFormat(
			FORMAT_STRING
		)}"`
	});

	// Get a string[] reference of all timestamps in year, so we can filter the real days out of mock
	const realDaysTimestamps = realDays.map((v) => v.timestamp);

	// Combine mock and real Days
	const days: EngagementDay[] = [
		...mockDays.filter((v) => {
			// Filter real days
			if (!realDaysTimestamps.includes(v.timestamp)) {
				return v;
			}
		}),
		...realDays
	].sort((a, b) => (a.timestamp < b.timestamp ? -1 : 1));

	console.log(days);

	return days;
}

/**
 * Get all Demonstrators from database and convert them into GenerationDemonstrator type
 *
 * @returns `Promise<GenerationDemonstrator[]>`
 */
async function getDemonstrators(): Promise<GenerationDemonstator[]> {
	const demonstrators = await (
		await pb.collection('demonstrators').getFullList()
	).map((v) => {
		const obj: GenerationDemonstator = {
			id: v.id,
			isSunlab: v.isSunlab,
			name: v.name,
			deficit: 0
		};
		return obj;
	});

	console.log(demonstrators);

	return demonstrators;
}

/**
 * Determine which Demonstrator is assigned the given Day.
 *
 * @param day given Day
 * @param demonstrators all Demonstrators
 * @param lastDemonstrator Demonstrator who visited the last Engagement
 *
 * @returns `GenerationDemonstrator` or `undefined`, if no Demonstrator could be found
 */
function determineDemonstratorForDay(
	day: EngagementDay,
	demonstrators: GenerationDemonstator[],
	lastDemonstrator: GenerationDemonstator | undefined
): GenerationDemonstator | undefined {
	let pool = demonstrators;
	// Remove unable demonstrators
	if (day.unable) {
		pool = pool.filter((v) => !day.unable?.includes(v.id));
	}

	// Remove demonstrators who cannot do sunlab, if the day is of sunlab type
	if (isDayFirstSunday(DateTime.fromFormat(day.timestamp, FORMAT_STRING))) {
		pool = pool.filter((v) => v.isSunlab);
	}

	// If possible, remove the demonstrator who went last time
	if (pool.length > 2) {
		pool = pool.filter((v) => v.id != lastDemonstrator?.id);
	}

	// Highest deficit
	pool.sort((a, b) => b.deficit - a.deficit);
	return pool[0];
}

/**
 * Update deficit after assignment
 *
 * All Demonstrators gain a deficit of 1, while the assigned Demonstrator loses a deficit of 1
 *
 * @param assignedDemonstrator assigned Demonstrator
 * @param demonstrators list of all Demonstrators
 *
 * @returns `void`
 */
function updateDeficit(
	assignedDemonstrator: GenerationDemonstator | undefined,
	demonstrators: GenerationDemonstator[]
): void {
	// Add a deficit to all demonstrators, avoiding a looped check
	for (let i = 0; i < demonstrators.length; i++) {
		demonstrators[i].deficit += 1;
	}

	if (assignedDemonstrator) {
		assignedDemonstrator.deficit -= 2; // Compensate the previous shortcut by removing 2 now
		assignedDemonstrator.deficit = Math.max(assignedDemonstrator.deficit, 0); // Clamp to 0 to avoid negative deficits
	}
}

/**
 * Upload the changes to given Day, either updating the entry in the database, or creating a new one
 *
 * @param day given Day
 */
async function uploadDay(day: EngagementDay) {
	if (day.id) {
		await pb.collection('days').update(day.id, { ...day }, { $autoCancel: false });
	} else {
		await pb.collection('days').create({ ...day }, { $autoCancel: false });
	}
}

/**
 * Upload the saved list of warnings, creating new entries in the database
 *
 * @param warnings list of warnings
 */
async function uploadWarnings(warnings: Warning[]) {
	for (const warning of warnings) {
		pb.collection('warnings').create(warning);
	}
}
