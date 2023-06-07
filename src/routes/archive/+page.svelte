<script lang="ts">
	import { archiveYear, updateArchiveCache } from '$lib/services/mockdays';
	import { currentUser, pb } from '$lib/services/pocketbase';
	import type ArchiveCache from '$lib/types/ArchiveCache';
	import { DateTime } from 'luxon';
	import { Admin } from 'pocketbase';
	import { onMount } from 'svelte';

	let archiveCaches: ArchiveCache[] = [];
	let year: number = DateTime.utc().year - 1;

	async function getData() {
		archiveCaches = await pb.collection('archiveCaches').getFullList();
	}

	onMount(async () => {
		await getData();
	});

	async function deleteArchive(archiveCache: ArchiveCache) {
		if (archiveCache.id) {
			await pb.collection('archiveCaches').delete(archiveCache.id);
			getData();
		}
	}
</script>

<div class="overflow-x-auto w-2/3 justify-center items-center flex flex-col">
	{#if archiveCaches.length > 0}
		<table class="table w-full">
			<thead>
				<tr>
					<th>Archive</th>
					<th>Visitors</th>
					<th>Engagements</th>
					{#if $currentUser.model instanceof Admin}
						<th class="flex justify-end">Actions</th>
					{/if}
				</tr>
			</thead>
			<tbody>
				{#each archiveCaches as archive}
					<tr>
						<td>
							<a href={`archive/${archive.year}`} class="link">{archive.year}</a>
						</td>
						<td>{archive.totalVisitors}</td>
						<td>{archive.numEngagements}</td>
						{#if $currentUser.model instanceof Admin}
							<td>
								<div class="flex flex-row justify-end">
									<button
										class="btn btn-sm btn-ghost btn-circle"
										on:click={async () => {
											await updateArchiveCache(archive);
											await getData();
										}}
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											stroke-width="1.5"
											stroke="currentColor"
											class="w-6 h-6"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
											/>
										</svg>
									</button>
									<button
										class="btn btn-sm btn-ghost btn-circle text-error"
										on:click={() => deleteArchive(archive)}
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											stroke-width="1.5"
											stroke="currentColor"
											class="w-6 h-6"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
											/>
										</svg>
									</button>
								</div>
							</td>
						{/if}
					</tr>
				{/each}
				<tr />
			</tbody>
		</table>
	{:else}
		No archived data.
	{/if}
	{#if $currentUser.model instanceof Admin}
		<div class="divider" />
		<form class="form justify-center flex flex-col items-center gap-2 w-2/3">
			<div class="form-control w-full max-w-md">
				<label for="archiveYearInput" class="label">
					<span class="label-text"> Archive Year </span>
				</label>
				<select
					id="archiveYearInput"
					class="select select-bordered w-full max-w-md font-normal"
					bind:value={year}
				>
					<option disabled class="text-primary" value={''}>Archive Year</option>
					<option value={DateTime.utc().year - 1}>{DateTime.utc().year - 1}</option>
					<option value={DateTime.utc().year}>{DateTime.utc().year}</option>
					<option value={DateTime.utc().year + 1}>{DateTime.utc().year + 1}</option>
				</select>
			</div>

			<button
				class="btn"
				on:click={async () => {
					await archiveYear(year);
					await getData();
				}}
			>
				Archive year</button
			>
		</form>
	{/if}
</div>
