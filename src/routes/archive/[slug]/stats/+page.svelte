<script lang="ts">
	import { pb } from '$lib/services/pocketbase';
	import type ArchiveCache from '$lib/types/ArchiveCache';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { engagementTypes, visitorTypes } from '$lib/services/store';

	export let data: PageData;
	let archiveCache: ArchiveCache;

	async function getData() {
		archiveCache = await pb.collection('archiveCaches').getFirstListItem(`year=${data.year}`);
	}
	onMount(async () => {
		await getData();
	});
</script>

<div class="overflow-x-auto w-2/3 justify-center items-center flex flex-col">
	{#if archiveCache}
		<h3 class="text-2xl">Archive Statistics {data.year}</h3>
		<div class="divider" />
		<div class="flex flex-col justify-center gap-3 w-full">
			<div class="stats shadow stats-vertical sm:stats-horizontal">
				<div class="stat place-items-center">
					<div class="stat-title">Total Visitors</div>
					<div class="stat-value">{archiveCache.totalVisitors}</div>
				</div>
				<div class="stat place-items-center">
					<div class="stat-title">Total Engagements</div>
					<div class="stat-value">{archiveCache.numEngagements}</div>
				</div>
			</div>
		</div>
		{#if archiveCache.engagementTypes}
			<div class="flex flex-col justify-center gap-3 w-full mt-4">
				<h2 class="self-center text-xl">Visits by Engagement Type</h2>
				<div class="stats shadow stats-vertical sm:stats-horizontal">
					{#each $engagementTypes as engagementType}
						<div class="stat place-items-center">
							<div class="stat-title">{engagementType.name}</div>
							<div class="stat-value">{archiveCache.engagementTypes[engagementType.id] ?? 0}</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}
		{#if archiveCache.visitorTypes}
			<div class="flex flex-col justify-center gap-3 mt-4 w-full">
				<h2 class="self-center text-xl">Visits by Visitor Type</h2>
				<div class="stats shadow stats-vertical sm:stats-horizontal">
					{#each $visitorTypes as visitorType}
						<div class="stat place-items-center">
							<div class="stat-title">{visitorType.name}</div>
							<div class="stat-value">{archiveCache.visitorTypes[visitorType.id] ?? 0}</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}
	{/if}
</div>
