<script lang="ts">
	import { MONTHS, mockDays } from '$lib/services/mockdays';
	import type Day from '$lib/types/Day';
	import { onMount } from 'svelte';

	export let month: number;
	export let year: number;
	let days: Day[] = [];

	onMount(() => {
		days = mockDays(month, year);
	});

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
		<h3 class="text-xl uppercase items-center flex">{MONTHS[month - 1]} - {month}</h3>
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
</div>
