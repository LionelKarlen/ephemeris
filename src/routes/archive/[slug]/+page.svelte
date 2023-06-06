<script lang="ts">
	import MonthTable from '$lib/components/MonthTable.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<h3 class="text-3xl">Archive</h3>
<MonthTable month={1} year={Number.parseInt(data.year)} />
