<script lang="ts">
	import type Day from '$lib/types/Day';
	import type Demonstrator from '$lib/types/Demonstrator';
	import { Admin } from 'pocketbase';
	import DayHandler from './DayHandler.svelte';
	import Tile from './Tile.svelte';
	import { currentUser } from '$lib/services/pocketbase';

	export let days: Day[];
	export let demonstrator: Demonstrator;
</script>

<div class="flex flex-row w-full">
	<div class="widetile tile">
		{#if $currentUser.model instanceof Admin}
			<a href={`dashboard/demonstrators/${demonstrator.id}`}>
				{demonstrator.name}
			</a>
		{:else}
			<!--TODO: Calendar download-->
			{demonstrator.name}
		{/if}
	</div>
	<div class="flex flex-row flex-grow">
		{#each days as day}
			<Tile width={100 / days.length} {day}><DayHandler {day} {demonstrator} /></Tile>
		{/each}
	</div>
</div>
