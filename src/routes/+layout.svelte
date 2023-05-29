<script lang="ts">
	import Login from '$lib/components/Login.svelte';
	import { currentUser } from '$lib/services/pocketbase';
	import '../app.postcss';
	import Navbar from '../lib/components/Navbar.svelte';
</script>

{#if $currentUser.model != null}
	<Navbar />
	<div class="content flex flex-col px-20 items-center">
		<slot />
	</div>
{:else}
	<Login />
{/if}
