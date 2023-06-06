<script lang="ts">
	import type Day from '$lib/types/Day';
	import type Demonstrator from '$lib/types/Demonstrator';
	import { Admin } from 'pocketbase';
	import DayHandler from './DayHandler.svelte';
	import Tile from './Tile.svelte';
	import { currentUser } from '$lib/services/pocketbase';
	import { generateCalendar } from '$lib/services/calendar';
	import { FORMAT_STRING } from '$lib/services/mockdays';
	import { DateTime } from 'luxon';

	export let days: Day[];
	export let demonstrator: Demonstrator;
</script>

<div class="flex flex-row w-full">
	<div class="widetile tile p-3">
		{#if $currentUser.model instanceof Admin}
			<a href={`dashboard/demonstrators/${demonstrator.id}`}>
				{demonstrator.name}
			</a>
		{:else}
			{demonstrator.name}
		{/if}
		<div class="flex grow justify-end">
			<button
				class=""
				on:click={() =>
					generateCalendar(
						demonstrator,
						DateTime.fromFormat(days[0].timestamp, FORMAT_STRING).year
					)}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="w-3 h-3"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"
					/>
				</svg>
			</button>
		</div>
	</div>
	<div class="flex flex-row flex-grow">
		{#each days as day}
			<Tile width={100 / days.length} {day}><DayHandler {day} {demonstrator} /></Tile>
		{/each}
	</div>
</div>
