<script lang="ts">
	import { t } from '$lib/services/i18n';
	import { pb } from '$lib/services/pocketbase';
	import { Admin } from 'pocketbase';

	const ROUTES = [
		{
			name: $t('menu.archive'),
			route: '/archive'
		},
		{
			name: $t('menu.next'),
			route: '/next'
		},
		{
			name: 'Sign out',
			route: '/signout'
		}
	];
</script>

<div class="navbar bg-base-100 mb-16">
	<div class="navbar-start">
		<a class="btn btn-ghost normal-case text-xl" href="/">Ephemeris</a>
	</div>
	<div class="navbar-end">
		{#if pb.authStore.model instanceof Admin}
			<div class="dropdown z-10">
				<button tabindex="0" class="btn btn-ghost">{$t('menu.admin.admin')}</button>
				<ul tabindex="-1" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
					<li><a href="/dashboard/engagementType">{$t('menu.admin.engagementTypes')}</a></li>
					<li><a href="/dashboard/visitorType">{$t('menu.admin.visitorTypes')}</a></li>
					<li><a href="/dashboard/demonstrators">{$t('menu.admin.demonstrators')}</a></li>
					<li><a href="/dashboard/schedule">{$t('menu.admin.schedule')}</a></li>
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
