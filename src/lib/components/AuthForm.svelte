<script lang="ts">
	import { Button } from '$components';
	import type { ActionData } from '../../routes/register/$types';

	interface ComponentProps {
		isRegister: boolean;
		form?: ActionData;
	}

	let { isRegister, form }: ComponentProps = $props();
</script>

<div class="auth-container mx-auto mt-16 max-w-screen-lg px-[5%]">
	<h1 class="mb-8">{isRegister ? 'Register' : 'Login'}</h1>
	<div class="form-and-social-login flex flex-col sm:flex-row">
		<form
			class="auth-form flex w-full flex-col items-start sm:w-1/2 sm:border-r sm:border-gray-200 sm:pr-8"
			method="POST"
			action={isRegister ? '' : '/login/?/signInWithPassword'}
		>
			{#if form && form.errors?.length}
				{#each form.errors as error}
					<div class="auth-error">
						<p>{error}</p>
					</div>
				{/each}
			{/if}
			{#if isRegister}
				<input type="text" placeholder="Name" name="name" value={form?.name || ''} />
			{/if}
			<input type="email" placeholder="Email" name="email" value={form?.email || ''} />
			<input type="password" placeholder="Password" name="password" value={form?.password || ''} />
			{#if isRegister}
				<input
					type="password"
					placeholder="Password Confirmation"
					name="passwordConfirmation"
					value={form?.passwordConfirmation || ''}
				/>
			{/if}
			<Button type="submit">{isRegister ? 'Register' : 'Login'}</Button>
			{#if isRegister}
				<p class="mt-4 text-sm text-gray-500">
					Already have an account? <a class="border-b border-gray-500" href="/login">Login</a>
				</p>
			{:else}
				<p class="mt-4 text-sm text-gray-500">
					Don't have an account? <a class="border-b border-gray-500" href="/register">Register</a>
				</p>
			{/if}
		</form>
		<div class="social-login mt-8 w-full pl-0 sm:w-1/2 sm:pl-8">
			<!-- Add Google buttons here later-->
			<form method="POST" action={isRegister ? '/login/?/googleLogin' : '?/googleLogin'}>
				<Button type="submit">Login with Google</Button>
			</form>
		</div>
	</div>
</div>

<style>
	input {
		@apply mb-4 block w-full rounded-md border border-gray-300 bg-white/80 p-2;
	}

	input:last-of-type {
		margin-bottom: 1.5rem;
	}

	.auth-error {
		@apply mb-4 w-full rounded-md bg-red-500 p-2 text-sm text-white;
	}

	.auth-error:last-of-type {
		margin-bottom: 1.5rem;
	}
</style>
