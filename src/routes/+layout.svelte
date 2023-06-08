<script lang="ts">
	import LangSwitcher from '$lib/components/LangSwitcher.svelte';
	import Login from '$lib/components/Login.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import { currentUser } from '$lib/services/pocketbase';
	import { showModal } from '$lib/services/store';
	import '../app.postcss';
	import Navbar from '../lib/components/Navbar.svelte';
</script>

{#if $currentUser.model != null}
	<Navbar />
	<div class="content flex flex-col lg:px-20 md:px-10 items-center">
		<slot />
	</div>
	{#if $showModal}
		<Modal dismissSeconds={1.5} />
	{/if}
	<LangSwitcher />
{:else}
	<Login />
{/if}
