<script lang="ts">
	import MonthTable from '$lib/components/MonthTable.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<MonthTable month={1} year={Number.parseInt(data.year)} />
