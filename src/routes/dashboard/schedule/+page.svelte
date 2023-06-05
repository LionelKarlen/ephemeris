<script lang="ts">
	import { goto } from '$app/navigation';
	import { pb } from '$lib/services/pocketbase';
	import generateSchedule from '$lib/services/schedule';
	import { warnings } from '$lib/services/store';
	import { DateTime } from 'luxon';

	let year = DateTime.utc().year + 1;
	let status: 'form' | 'process' | 'success' | 'failure' = 'form';
	let error: Error | void;

	async function handleGenerate() {
		status = 'process';
		error = await generateSchedule(year);
		warnings.set(await pb.collection('warnings').getFullList());
		status = error ? 'failure' : 'success';
	}
</script>

{#if status == 'form'}
	<!-- content here -->
	<form
		on:submit|preventDefault={handleGenerate}
		class="form justify-center flex flex-col items-center gap-2 w-2/3"
	>
		<div class="form-control w-full max-w-md">
			<label for="scheduleYearInput" class="label">
				<span class="label-text"> Schedule Year </span>
			</label>
			<select
				id="scheduleYearInput"
				class="select select-bordered w-full max-w-mdi font-normal"
				bind:value={year}
			>
				<option disabled class="text-primary" value={''}>Schedule Year</option>
				<option value={DateTime.utc().year}>{DateTime.utc().year}</option>
				<option value={DateTime.utc().year + 1}>{DateTime.utc().year + 1}</option>
			</select>
		</div>

		<button class="btn"> Generate schedule </button>
	</form>
{:else if status == 'process'}
	<div class="w-2/3 flex justify-center items-center flex-col gap-2">
		<span class="loading loading-bars loading-lg" />
		<h3 class="font-bold">Generating your Schedule...</h3>
	</div>
{:else if status == 'success'}
	<div class="w-2/3 flex justify-center items-center flex-col">
		<div class="alert shadow-lg alert-success">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="stroke-current shrink-0 h-6 w-6"
				fill="none"
				viewBox="0 0 24 24"
				><path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
				/></svg
			>
			<div>
				<h3 class="font-bold">Complete!</h3>
				<div class="text-xs">Successfully generated schedule for year {year}!</div>
			</div>
			<button class="btn btn-sm btn-ghost" on:click={() => goto('/')}>See</button>
		</div>
	</div>
{:else}
	<div class="w-2/3 flex justify-center items-center flex-col">
		<div class="alert shadow-lg alert-error">
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
					d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
				/>
			</svg>

			<div>
				<h3 class="font-bold">Something went wrong...</h3>
				<div class="text-xs">
					An error occured while generating schedule. Please try again at a later time. If the issue
					persists, reach out to the developer.
				</div>
				<div class="text-xs font-bold">
					{error}
				</div>
			</div>
			<button
				class="btn btn-sm btn-ghost"
				on:click={() => {
					status = 'form';
				}}>Ok</button
			>
		</div>
	</div>
{/if}
