<script lang="ts">
	import '../app.postcss';
	import Navbar from '../lib/components/Navbar.svelte';
</script>

<Navbar />
<div class="content flex flex-col px-20">
	<slot />
</div>
