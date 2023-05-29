<script lang="ts">
	import { pb } from '$lib/services/pocketbase';
	import { Admin } from 'pocketbase';

	const ROUTES = [
		{
			name: 'archive',
			route: '/archive'
		},
		{
			name: 'next year',
			route: '/next'
		},
		{
			name: 'Sign out',
			route: '/signout'
		}
	];
</script>

<div class="navbar bg-base-100 mb-20">
	<div class="navbar-start">
		<a class="btn btn-ghost normal-case text-xl" href="/">Ephemeris</a>
	</div>
	<div class="navbar-end">
		{#if pb.authStore.model instanceof Admin}
			<a href="/dashboard" class="btn btn-ghost">Admin</a>
		{/if}
		{#each ROUTES as route}
			<a class="btn btn-ghost" href={route.route}>
				{route.name}
			</a>
		{/each}
	</div>
</div>
