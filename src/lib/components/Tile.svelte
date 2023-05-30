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
	style={`min-width: ${width}% !important; max-width: ${width}% !important`}
	class:regular={dateTime.weekday == 3}
	class:sunlab={dateTime.weekday == 7 && dateTime < dateTime.startOf('month').plus({ weeks: 1 })}
	class:weekend={dateTime.weekday >= 6}
>
	<slot />
</div>

<style>
	.regular {
		background-color: rgb(165, 154, 238);
	}
	.sunlab {
		background-color: rgb(253, 187, 65) !important;
	}
	.weekend {
		background-color: rgb(255, 255, 123);
	}
</style>
