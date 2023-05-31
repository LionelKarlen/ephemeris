<script>
	import { goto } from '$app/navigation';
	import { currentUser } from '$lib/services/pocketbase';
	import { Admin } from 'pocketbase';
</script>

{#if $currentUser.model instanceof Admin}
	<slot />
{:else}
	{goto('/')}
{/if}
