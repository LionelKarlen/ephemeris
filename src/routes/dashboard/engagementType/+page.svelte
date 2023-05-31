<script>
	import DisplayList from '$lib/components/DisplayList.svelte';
	import { pb } from '$lib/services/pocketbase';
	import { engagementTypes } from '$lib/services/store';

	async function getEngagementType() {
		engagementTypes.set(await pb.collection('engagementType').getFullList());
	}
</script>

<DisplayList
	list={$engagementTypes}
	title={'Engagement'}
	collection="engagementType"
	on:update={getEngagementType}
/>
