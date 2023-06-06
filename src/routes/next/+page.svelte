<script>
	import MonthTable from '$lib/components/MonthTable.svelte';
	import { DateTime } from 'luxon';
	let dateTime = DateTime.utc();
</script>

<h3 class="text-3xl">Next Year</h3>
<MonthTable month={dateTime.month} year={dateTime.year + 1} />
