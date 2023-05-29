<script lang="ts">
	import { currentUser, pb } from '$lib/services/pocketbase';

	let username = '';
	let password = '';
	async function login() {
		if (username.includes('@')) {
			await pb.admins.authWithPassword(username, password);
		} else {
			await pb.collection('users').authWithPassword(username, password);
		}
		currentUser.set(pb.authStore);
	}
</script>

<form class="content flex flex-col px-20 items-center gap-5 py-20" on:submit|preventDefault={login}>
	<h1 class="text-3xl mb-5">Ephemeris</h1>
	<input
		type="text"
		placeholder="Username"
		class="input input-bordered w-full max-w-xs"
		bind:value={username}
	/>
	<input
		type="password"
		placeholder="Password"
		class="input input-bordered w-full max-w-xs"
		bind:value={password}
	/>
	<button class="btn btn-primary">Login</button>
</form>
