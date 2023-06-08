<script>
	import MonthTable from '$lib/components/MonthTable.svelte';
	import { t } from '$lib/services/i18n';
	import { DateTime } from 'luxon';
	let dateTime = DateTime.utc();
</script>

<h3 class="text-3xl">{$t('menu.next')}</h3>
<MonthTable month={dateTime.month} year={dateTime.year + 1} />
