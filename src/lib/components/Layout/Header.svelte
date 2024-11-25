<script lang="ts">
	import Logo from '$assets/app-logo.svg';
	import { Button } from '$components';
	import { getUserState } from '$lib/state/user-state.svelte';

	let userContext = getUserState();
	let { user, userName } = $derived(userContext);

	// $inspect(user);
</script>

<header class="flex items-center justify-between p-4 md:p-8">
	<a href={user ? '/private/dashboard' : '/'}>
		<img src={Logo} alt="Logo" class="h-18" />
	</a>
	<nav>
		{#if !user}
			<ul class="flex gap-4">
				<li>
					<Button isMenu={true} href="/register">Create Account</Button>
				</li>
				<li>
					<Button isMenu={true} isSecondary={true} href="/login">Login</Button>
				</li>
			</ul>
		{:else}
			<ul class="flex items-center gap-4">
				<li class="flex items-center">
					<span class="text-center">{userName}</span>
				</li>
				<li>
					<Button isMenu={true} onclick={() => userContext.logout()}>Logout</Button>
				</li>
			</ul>
		{/if}
	</nav>
</header>
