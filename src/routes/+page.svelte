<script>
	import MonthTable from '$lib/components/MonthTable.svelte';
	import { DateTime } from 'luxon';
	let dateTime = DateTime.utc();
</script>

<MonthTable month={dateTime.month} year={dateTime.year} />
