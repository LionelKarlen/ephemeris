<script lang="ts">
	import { goto } from '$app/navigation';
	import { pb } from '$lib/services/pocketbase';
	import type { EngagementDay } from '$lib/types/Day';
	import { DateTime } from 'luxon';
	import {
		FORMAT_STRING,
		formatLegible,
		isDayFirstSunday,
		isDayWednesday
	} from '$lib/services/mockdays';
	import { engagementTypes, showModal, visitorTypes } from '$lib/services/store';
	import type { PageData } from './$types';
	import { t } from '$lib/services/i18n';

	export let data: PageData;

	let day: EngagementDay;
	let timestamp: DateTime;

	async function getData() {
		if (data.id == 'undefined') {
			goto('/');
		}
		day = await pb.collection('days').getOne(data.id);
		timestamp = DateTime.fromFormat(day.timestamp, FORMAT_STRING);
		if (!day.engagementType) {
			if (isDayWednesday(timestamp)) {
				day.engagementType = $engagementTypes[0].id;
			} else if (isDayFirstSunday(timestamp)) {
				day.engagementType = $engagementTypes[1].id;
			}
		}
		if (!day.visitorType) {
			day.visitorType = $visitorTypes[0].id;
		}
	}

	async function handleSubmit() {
		console.log(day);
		if (day.id) {
			await pb.collection('days').update(day.id, day);
		}
		showModal.set(true);
		goto('/');
	}

	$: data, getData();
</script>

{#if day}
	<form
		class="form justify-center flex flex-col items-center gap-2 w-2/3"
		on:submit|preventDefault={handleSubmit}
	>
		<h3 class="text-2xl">
			{formatLegible(timestamp)}
		</h3>
		<div class="divider" />
		<div class="form-control w-full max-w-md">
			<label for="numVisitorInput" class="label"
				><span class="label-text">{$t('engagementForm.visitorNumber')}</span></label
			>
			<input
				id="numVisitorInput"
				type="number"
				placeholder="Visitor Number"
				min="0"
				bind:value={day.visitorNumber}
				class="input input-bordered w-full max-w-md"
			/>
		</div>
		<div class="form-control w-full max-w-md">
			<label for="visitorTypeInput" class="label">
				<span class="label-text">{$t('engagementForm.visitorType')}</span>
			</label>
			<select
				id="visitorTypeInput"
				class="select select-bordered w-full max-w-mdi font-normal"
				bind:value={day.visitorType}
			>
				<option disabled class="text-primary" value={''}>{$t('engagementForm.visitorType')}</option>
				{#each $visitorTypes as visitorType}
					<option value={visitorType.id}>{visitorType.name}</option>
				{/each}
			</select>
		</div>
		<div class="form-control w-full max-w-md">
			<label for="engagementTypeInput" class="label">
				<span class="label-text"> {$t('engagementForm.engagementType')}</span>
			</label>
			<select
				id="engagementTypeInput"
				class="select select-bordered w-full max-w-mdi font-normal"
				bind:value={day.engagementType}
			>
				<option disabled class="text-primary" value={''}
					>{$t('engagementForm.engagementType')}</option
				>
				{#each $engagementTypes as engagementType}
					<option value={engagementType.id}>{engagementType.name}</option>
				{/each}
			</select>
		</div>
		<div class="divider" />
		<div class="form-control w-full max-w-md">
			<label for="numVisitorInput" class="label"
				><span class="label-text">{$t('engagementForm.comment')}</span></label
			>
			<input
				id="numVisitorInput"
				type="text"
				placeholder="Comment"
				bind:value={day.comment}
				class="input input-bordered w-full max-w-md"
			/>
		</div>
		<button class="btn btn-primary">{$t('engagementForm.save')}</button>
	</form>
{:else}
	no data
{/if}
