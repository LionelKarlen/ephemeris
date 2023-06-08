<script lang="ts">
	import { locale } from '$lib/services/i18n';

	let state = false;

	function handleSwitchState(state: boolean) {
		if (state) {
			locale.set('en');
		} else {
			locale.set('de');
		}
	}
	$: handleSwitchState(state);
</script>

<div class="langSwitcher md:px-2">
	<label class="swap text-secondary">
		<input type="checkbox" bind:checked={state} />
		<div class="swap-on">DE</div>
		<div class="swap-off">EN</div>
	</label>
</div>

<style>
	.langSwitcher {
		position: absolute;
		bottom: 0px;
	}
</style>
