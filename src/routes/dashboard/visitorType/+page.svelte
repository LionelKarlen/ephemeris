<script>
	import DisplayList from '$lib/components/DisplayList.svelte';
	import { pb } from '$lib/services/pocketbase';
	import { visitorTypes } from '$lib/services/store';

	const collection = 'visitorType';

	async function getVisitorType() {
		visitorTypes.set(await pb.collection(collection).getFullList());
	}
</script>

<DisplayList list={$visitorTypes} title={'Visitor'} {collection} on:update={getVisitorType} />
