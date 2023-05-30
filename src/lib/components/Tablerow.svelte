<script lang="ts">
	import type Day from '$lib/types/Day';
	import type Demonstrator from '$lib/types/Demonstrator';
	import Tile from './Tile.svelte';

	export let days: Day[];
	export let demonstrator: Demonstrator;
</script>

<div class="flex flex-row w-full">
	<div class="widetile tile">{demonstrator.name}</div>
	<div class="flex flex-row flex-grow">
		{#each days as day}
			<Tile width={100 / days.length} {day} />
		{/each}
	</div>
</div>
