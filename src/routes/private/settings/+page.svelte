<script lang="ts">
	import { getUserState } from '$lib/state/user-state.svelte';
	import { Button } from '$components';

	let userContext = getUserState();
	let userName = $state(userContext.userName || '');
	let isEditMode = $state(false);

	let email = $state(userContext.user?.email || '');

	let averageRating = $derived.by(() => {
		const booksWithRating = userContext.allBooks.filter((book) => book.rating);

		if (booksWithRating.length === 0) {
			return 'No ratings yet.';
		}

		const totalRating = booksWithRating.reduce((acc, book) => acc + book.rating!, 0);

		return Math.round((100 * totalRating) / booksWithRating.length) / 100;
	});

	$effect(() => {
		if (userContext.userName) {
			userName = userContext.userName;
		}
	});

	async function toggleEditModeAndSaveToDatabase() {
		if (isEditMode) {
			await userContext.updateAccountData(email, userName);
		}
		isEditMode = !isEditMode;
	}

	async function deleteAccount() {
		const confirmation = window.confirm('Are you sure you want to delete your account?');

		if (confirmation) {
			await userContext.deleteAccount();
		}
	}
</script>

<div class="settings-page flex w-full items-center justify-start">
	<div
		class="settings-container mr-20 [&_input]:w-full [&_input]:rounded-lg [&_input]:border-none [&_input]:bg-white/50 [&_input]:p-2"
	>
		<h2>Settings</h2>

		<h5 class="mb-1 mt-4 font-semibold">Username</h5>
		{#if isEditMode}
			<input type="text" name="userName" bind:value={userName} />
		{:else}
			<h3>{userName}</h3>
		{/if}
		<h5 class="mb-1 mt-4 font-semibold">Email</h5>
		{#if isEditMode}
			<input type="text" name="email" bind:value={email} />
		{:else}
			<h3>{email}</h3>
		{/if}
		<div class="buttons-container mb-8 mt-8 flex gap-4">
			<Button isSecondary={true} onclick={toggleEditModeAndSaveToDatabase}>
				{isEditMode ? 'Save changes' : 'Edit'}
			</Button>
			<Button isDanger={true} onclick={deleteAccount}>Delete account</Button>
		</div>
	</div>
	<div class="stats-container mb-10 min-w-[25%] rounded-xl bg-white/50 px-6 py-2">
		<h5 class="font-semibold">Books in library</h5>
		<h3>{userContext.allBooks.length}</h3>
		<h5 class="mt-4 font-semibold">Finished books</h5>
		<h3>{userContext.allBooks.filter((book) => Boolean(book.finished_reading_on)).length}</h3>
		<h5 class="mt-4 font-semibold">Average rating given</h5>
		<h3>{averageRating}</h3>
	</div>
</div>
