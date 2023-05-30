<script lang="ts">
	import { FORMAT_STRING } from '$lib/services/mockdays';
	import type Day from '$lib/types/Day';
	import { DateTime } from 'luxon';

	export let width: number;
	export let day: Day;
	$: dateTime = DateTime.fromFormat(day.timestamp, FORMAT_STRING, { zone: 'utc' });
</script>

<div
	class="tile"
	style={`min-width: ${width}%; max-width: ${width}%`}
	class:regular={dateTime.weekday == 3}
	class:sunlab={dateTime.weekday == 7 && dateTime < dateTime.startOf('month').plus({ weeks: 1 })}
>
	<slot />
</div>

<style>
	.regular {
		background-color: blue;
	}
	.sunlab {
		background-color: orange;
	}
</style>
