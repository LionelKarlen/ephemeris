<script lang="ts">
	import { pb } from '$lib/services/pocketbase';
	import type { EngagementDay } from '$lib/types/Day';
	import { DayStatus } from '$lib/types/DayStatus';
	import type Demonstrator from '$lib/types/Demonstrator';
	import { onMount } from 'svelte';

	export let day: EngagementDay;
	export let demonstrator: Demonstrator;
	let status = DayStatus.NONE;
	onMount(() => {
		handleDayDisplay();
	});
	function handleDayDisplay() {
		if (day.id) {
			if (day.assigned?.includes(demonstrator.id)) {
				status = DayStatus.ASSIGNED;
			}
			if (day.unable?.includes(demonstrator.id)) {
				status = DayStatus.UNABLE;
			}
			if (day.reserved?.includes(demonstrator.id)) {
				status = DayStatus.RESERVED;
			}
		}
		status = DayStatus.NONE;
	}

	function handleUpdateStatus(oldStatus: number) {
		if (oldStatus == 0) {
			if (day.unable) {
				day.unable.push(demonstrator.id);
			} else {
				day.unable = [demonstrator.id];
			}
		}
		if (oldStatus == 1) {
			if (day.unable) {
				day.unable = day.unable.filter((v) => v != demonstrator.id);
			}
			if (day.reserved) {
				day.reserved.push(demonstrator.id);
			} else {
				day.reserved = [demonstrator.id];
			}
		}
		if (oldStatus == 2) {
			if (day.reserved) {
				day.reserved = day.reserved.filter((v) => v != demonstrator.id);
			}
			if (day.assigned) {
				day.assigned.push(demonstrator.id);
			} else {
				day.assigned = [demonstrator.id];
			}
		}
		if (oldStatus == 3) {
			if (day.assigned) {
				day.assigned = day.assigned.filter((v) => v != demonstrator.id);
			}
		}
	}

	async function handleClick() {
		let tmpStatus = status;
		tmpStatus += 1;
		tmpStatus = tmpStatus % 4;
		handleUpdateStatus(status);
		status = tmpStatus;
		await uploadDay();
	}

	async function uploadDay() {
		if (day.id) {
			day = await pb.collection('days').update(day.id, day);
		} else {
			day = await pb.collection('days').create(day);
		}
	}
</script>

<!-- TODO: a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<span
	on:click={handleClick}
	class="w-full h-full"
	class:assigned={day.assigned?.includes(demonstrator.id)}
>
	{#if status == DayStatus.ASSIGNED}
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="1.5"
			stroke="currentColor"
			class="w-6 h-6"
		>
			<path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
		</svg>
	{:else if status == DayStatus.RESERVED}
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
				d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
			/>
		</svg>
	{:else if status == DayStatus.UNABLE}
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="1.5"
			stroke="currentColor"
			class="w-6 h-6"
		>
			<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
		</svg>
	{/if}
</span>

<style>
	span {
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
	}

	.assigned {
		background-color: rgb(101, 192, 101) !important;
	}
</style>
