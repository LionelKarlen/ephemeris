<script lang="ts">
	export let width: number;
</script>

<div class="tile" style={`min-width: ${width}%; max-width: ${width}%`}>
	<slot />
</div>
