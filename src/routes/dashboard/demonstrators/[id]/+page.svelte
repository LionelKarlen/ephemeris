<script lang="ts">
	import { pb } from '$lib/services/pocketbase';
	import type Demonstrator from '$lib/types/Demonstrator';
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	import { demonstrators } from '$lib/services/store';
	import { t } from '$lib/services/i18n';

	export let data: PageData;

	let demonstrator: Demonstrator;

	async function getData() {
		if (data.id == 'new') {
			demonstrator = {
				id: 'new',
				name: 'name',
				isSunlab: false
			};
		} else {
			demonstrator = await pb.collection('demonstrators').getOne(data.id);
		}
	}

	$: data, getData();

	async function update() {
		demonstrators.set(await pb.collection('demonstrators').getFullList());
		goto('/');
	}

	async function handleSubmit() {
		if (demonstrator.id == 'new') {
			const obj = {
				name: demonstrator.name,
				isSunlab: demonstrator.isSunlab
			};
			await pb.collection('demonstrators').create(obj);
		} else {
			await pb.collection('demonstrators').update(demonstrator.id, demonstrator);
		}
		update();
	}

	async function deleteDemonstrator() {
		await pb.collection('demonstrators').delete(demonstrator.id);
		update();
	}
</script>

{#if demonstrator}
	<form
		class="form justify-center flex flex-col items-center gap-2 w-2/3"
		on:submit|preventDefault={handleSubmit}
	>
		<div class="flex flex-row items-center gap-4">
			<h3 class="text-2xl">
				{data.id == 'new'
					? $t('demonstrators.newDemonstrator')
					: $t('demonstrators.editDemonstrator')}
			</h3>
			{#if data.id != 'new'}
				<button class="btn btn-circle btn-ghost text-error" on:click={deleteDemonstrator}>
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
			{/if}
		</div>
		<div class="divider" />
		<div class="form-control w-full max-w-md">
			<label for="demonstratorName" class="label"
				><span class="label-text">{$t('demonstrators.name')}</span></label
			>
			<input
				id="demonstratorName"
				type="text"
				placeholder="Name"
				bind:value={demonstrator.name}
				class="input input-bordered w-full max-w-md"
			/>
		</div>
		<div class="form-control w-full max-w-md">
			<label class="label cursor-pointer flex flex-col">
				<span class="label-text self-start">{$t('demonstrators.sunlab')}</span>
				<input type="checkbox" class="toggle" bind:checked={demonstrator.isSunlab} />
			</label>
		</div>
		<button class="btn btn-primary">{$t('demonstrators.save')}</button>
	</form>
{:else}
	No data
{/if}
