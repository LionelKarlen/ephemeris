<script lang="ts">
	import { goto } from '$app/navigation';
	import { pb } from '$lib/services/pocketbase';
	import type BaseType from '$lib/types/BaseType';
	import { DateTime } from 'luxon';
	import { createEventDispatcher } from 'svelte';

	export let list: BaseType[];
	export let title: string;
	export let collection: string;

	const dispatch = createEventDispatcher();

	function addToList() {
		list.push({
			id: `id-${DateTime.utc().toUnixInteger()}`,
			name: `New ${title}`
		});
		list = list;
	}

	async function deleteFromList(id: string) {
		let index = list.findIndex((v) => v.id == id);
		list.splice(index, 1);
		if (!id.startsWith('id-')) {
			await pb.collection(collection).delete(id);
		}
		list = list;
	}

	async function update() {
		for (const item of list) {
			if (item.id.startsWith('id-')) {
				const tmpItem = {
					name: item.name
				};
				const responseItem: BaseType = await pb.collection(collection).create(tmpItem);
				item.id = responseItem.id;
			} else {
				pb.collection(collection).update(item.id, item);
			}
		}
		list = list;
		dispatch('update');

		goto('/');
	}
</script>

<div class="overflow-x-auto w-2/3">
	<table class="table w-full">
		<thead>
			<tr>
				<th>{title}</th>
				<th class="justify-end flex">Actions</th>
			</tr>
		</thead>
		<tbody>
			{#each list as item}
				<tr>
					<td><input type="text" class="input input-ghost full-ghost" bind:value={item.name} /></td>
					<td>
						<div class="flex flex-row justify-end">
							<button class="btn btn-sm btn-ghost" on:click={() => deleteFromList(item.id)}>
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
				</tr>
			{/each}
			<tr>
				<td />
				<td>
					<div class="flex flex-row justify-end">
						<button class="btn btn-circle" on:click={addToList}>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								class="w-6 h-6"
							>
								<path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
							</svg>
						</button>
					</div>
				</td>
			</tr>
		</tbody>
	</table>
	<button class="btn btn-primary" on:click={update}>Update</button>
</div>

<style>
	.full-ghost {
		--tw-bg-opacity: 0;
		border: none;
		cursor: text;
	}
</style>
