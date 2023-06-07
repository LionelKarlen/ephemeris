<script lang="ts">
	import { showModal } from '$lib/services/store';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	export let dismissSeconds: number;

	onMount(async () => {
		await timer(dismissSeconds);
		showModal.set(false);
	});

	function timer(seconds: number) {
		return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
	}
</script>

<div class="toast toast-center" transition:fade>
	<div class="alert alert-success">
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
		<span>Saved</span>
	</div>
</div>
