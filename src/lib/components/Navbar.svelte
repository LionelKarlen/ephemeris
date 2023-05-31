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
			<div class="dropdown">
				<button tabindex="0" class="btn btn-ghost">Admin</button>
				<ul tabindex="-1" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
					<li><a href="/dashboard/engagementType">Engagement Types</a></li>
					<li><a href="/dashboard/visitorType">Visitor Types</a></li>
					<li><a href="/dashboard/demonstrators">Demonstrators</a></li>
				</ul>
			</div>
		{/if}
		{#each ROUTES as route}
			<a class="btn btn-ghost" href={route.route}>
				{route.name}
			</a>
		{/each}
	</div>
</div>
