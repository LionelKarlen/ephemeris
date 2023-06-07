<script lang="ts">
	import { goto } from '$app/navigation';
	import MonthTable from '$lib/components/MonthTable.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<h3 class="text-3xl">
	Archive <button
		class="btn btn-sm btn-ghost btn-circle"
		on:click={() => goto(`${data.year}/stats`)}
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="1.5"
			stroke="currentColor"
			class="w-4 h-4"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605"
			/>
		</svg>
	</button>
</h3>
<MonthTable month={1} year={Number.parseInt(data.year)} />
