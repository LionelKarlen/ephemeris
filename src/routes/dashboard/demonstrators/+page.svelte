<script lang="ts">
	import { demonstrators } from '$lib/services/store';
</script>

<div class="overflow-x-auto w-2/3">
	<table class="table w-full">
		<thead>
			<tr>
				<th>Demonstrator</th>
			</tr>
		</thead>
		<tbody>
			{#each $demonstrators as demonstrator}
				<tr>
					<td>
						<a href={`demonstrators/${demonstrator.id}`}>{demonstrator.name}</a>
					</td>
				</tr>
			{/each}
			<tr />
		</tbody>
	</table>
	<div class="flex flex-row justify-center">
		<a class="btn" href="demonstrators/new">Add Demonstrator</a>
	</div>
</div>
