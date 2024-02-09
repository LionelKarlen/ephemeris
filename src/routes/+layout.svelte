<script lang="ts">
	import LangSwitcher from '$lib/components/LangSwitcher.svelte';
	import Login from '$lib/components/Login.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import { currentUser, pb } from '$lib/services/pocketbase';
	import { demonstrators, engagementTypes, showModal, visitorTypes } from '$lib/services/store';
	import '../app.postcss';
	import Navbar from '../lib/components/Navbar.svelte';

	let propagate = true;
	async function updateEmptyCollections() {
		console.log('valled');
		if (propagate) {
			if ($demonstrators.length == 0) {
				propagate = false;
				demonstrators.set(await pb.collection('demonstrators').getFullList());
			}
			if ($visitorTypes.length == 0) {
				propagate = false;
				visitorTypes.set(await pb.collection('visitorType').getFullList());
			}
			if ($engagementTypes.length == 0) {
				propagate = false;
				engagementTypes.set(await pb.collection('engagementType').getFullList());
			}
		}
	}
</script>

{#if $currentUser.model != null}
	<Navbar />
	<div class="content flex flex-col lg:px-20 md:px-10 items-center">
		{#await updateEmptyCollections()}
			<span class="loading loading-bars loading-lg" />
		{:then value}
			<slot />
		{/await}
	</div>
	{#if $showModal}
		<Modal dismissSeconds={1.5} />
	{/if}
	<LangSwitcher />
{:else}
	<Login />
{/if}
