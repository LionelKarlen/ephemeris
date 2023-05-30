<script lang="ts">
	import Login from '$lib/components/Login.svelte';
	import { currentUser } from '$lib/services/pocketbase';
	import '../app.postcss';
	import Navbar from '../lib/components/Navbar.svelte';
</script>

{#if $currentUser.model != null}
	<Navbar />
	<div class="content flex flex-col lg:px-20 md:px-10 items-center">
		<slot />
	</div>
{:else}
	<Login />
{/if}
