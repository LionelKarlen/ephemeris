<script lang="ts">
	import { goto } from '$app/navigation';
	import { pb } from '$lib/services/pocketbase';
	import { onMount } from 'svelte';

	onMount(() => {
		pb.authStore.clear();
		goto('/');
	});
</script>
