<script lang="ts">
	import type { Book } from '$lib/state/user-state.svelte';
	import BookCard from './BookCard.svelte';

	interface BookCategoryProps {
		categoryName: string;
		bookToDisplay: Book[];
	}

	let { categoryName, bookToDisplay }: BookCategoryProps = $props();
</script>

<section class="book-category mb-8">
	<h3 class="mb-4 text-2xl font-bold">{categoryName}</h3>
	<div class="book-container flex gap-4 overflow-x-auto pb-2">
		{#each bookToDisplay as book}
			<BookCard {book} />
		{/each}
	</div>
</section>

<style>
	/* width */
	::-webkit-scrollbar {
		height: 6px;
	}

	::-webkit-scrollbar-thumb {
		background-color: rgba(0, 0, 0, 0.2);
		border-radius: 3px;
	}
	.book-container {
		scrollbar-width: thin;
	}
</style>
