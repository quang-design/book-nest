<script lang="ts">
	import BookCategory from '$components/BookCategory.svelte';
	import { getUserState } from '$lib/state/user-state.svelte';
	import Icon from '@iconify/svelte';

	let userContext = getUserState();
	let { userName, allBooks } = $derived(userContext);
</script>

<div class="dashboard">
	<div class="dashboard-header mb-8 flex w-full items-start justify-between">
		<a href="/private/scan-shelf" class="add-book flex items-center no-underline">
			<Icon icon="icons8:plus" width={'72'} height={'72'} />
			<p class="ml-2 text-lg font-bold">Add Book</p>
		</a>
		<div class="headline min-w-72 max-w-[30%] text-right">
			<h3 class="text-2xl font-bold">Welcome Back, {userName}</h3>
			<p>
				There's nothing quite like the journey of a good book can take you on. Have you discovered
				any new favorite books lately?
			</p>
		</div>
	</div>
	<!-- Book Category -->
	{#if allBooks.length}
		{#if userContext.getHighestRatedBooks().length}
			<BookCategory
				categoryName="Your Most Loved Books"
				bookToDisplay={userContext.getHighestRatedBooks()}
			/>
		{/if}
		<BookCategory categoryName="Recently Added" bookToDisplay={userContext.getUnreadBooks()} />
		{#if userContext.getFavoriteGenreBooks()}
			<BookCategory
				categoryName={`Highest Rated Books from your favorite genre: ${userContext.getFavoriteGenreBooks()}`}
				bookToDisplay={userContext.getBooksFromFavoriteGenre()}
			/>
		{/if}
	{:else}
		<a
			href="/private/scan-shelf"
			class="flex w-full flex-col items-center justify-center no-underline"
		>
			<h3>You haven't added any books yet. Click here to add your first book.</h3>
			<div class="add-book flex items-center justify-center">
				<Icon icon="icons8:plus" width={'72'} height={'72'} />
				<p class="ml-2 text-lg font-bold">Add Book</p>
			</div>
		</a>
	{/if}
</div>
