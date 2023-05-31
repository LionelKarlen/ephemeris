<script lang="ts">
	import { FORMAT_STRING, MONTHS, mockDays } from '$lib/services/mockdays';
	import type Day from '$lib/types/Day';
	import { demonstrators, isEditMode } from '$lib/services/store';
	import Tile from './Tile.svelte';
	import Tablerow from './Tablerow.svelte';
	import { DateTime } from 'luxon';
	import { pb } from '$lib/services/pocketbase';
	import type { EngagementDay } from '$lib/types/Day';

	export let month: number;
	export let year: number;
	let days: Day[];

	$: month, getData();

	async function getData() {
		days = await getDays();
	}

	pb.collection('days').subscribe('*', () => {
		//TODO: Maybe clean this up so that we don't grab all data again, but this makes a minor difference in the end since it's only one request more.
		getData();
	});

	async function getDays() {
		const start = DateTime.utc(year, month, 1);
		const end = start.endOf('month').plus(1);
		const records: EngagementDay[] = await pb.collection('days').getFullList({
			filter: `timestamp>="${start.toFormat(FORMAT_STRING)}" && timestamp < "${end.toFormat(
				FORMAT_STRING
			)}"`
		});
		console.log('records', records);

		const timestamps = records.map((v) => {
			return v.timestamp;
		});
		const mocks = mockDays(month, year, timestamps);

		let days = [...mocks, ...records];
		days.sort((a, b) => (a.timestamp < b.timestamp ? -1 : 1));
		console.log('days', days);
		return days;
	}

	function handleChangeMonth(direction: number) {
		let tmpMonth = month - 1;
		tmpMonth += direction;
		tmpMonth = (tmpMonth % 12) + 1;
		if (tmpMonth == 0) {
			tmpMonth = 12;
		}
		month = tmpMonth;
	}
</script>

{#if days}
	<!-- content here -->
	<div class="table w-full flex flex-col">
		<div class="flex flex-row control justify-between">
			<button class="btn btn-square btn-primary" on:click={() => handleChangeMonth(-1)}
				><svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="w-6 h-6"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
				</svg>
			</button>
			<h3 class="text-xl uppercase items-center flex">{MONTHS[month - 1]} - {year}</h3>
			<button class="btn btn-square btn-primary" on:click={() => handleChangeMonth(1)}
				><svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="w-6 h-6"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
				</svg>
			</button>
		</div>
		<div class="flex flex-row w-full">
			<div class="widetile tile" />
			<div class="flex flex-row flex-grow">
				{#each days as day, i}
					<Tile width={100 / days.length} {day}>
						{#if day.id}
							<a href={`/day/${day.id}`}>
								{i + 1}
							</a>
						{:else}
							{i + 1}
						{/if}
					</Tile>
				{/each}
			</div>
		</div>
		{#each $demonstrators as demonstrator}
			<Tablerow {days} {demonstrator} />
		{/each}
		<div class="flex flex-row-reverse gap-4 mt-3">
			<input type="checkbox" class="toggle toggle-primary" bind:checked={$isEditMode} />
			<span class="label-text">Edit mode</span>
		</div>
	</div>
{:else}
	<!-- else content here -->
{/if}

<style global>
	.widetile {
		min-width: 20%;
		max-width: 20%;
		min-height: 2.5rem;
		max-height: 2.5rem;
		justify-content: start;
	}
	.tile {
		border: 1px black solid;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
	}
	.label-text {
		-webkit-touch-callout: none;
		-webkit-user-select: none;
		-khtml-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}
</style>
