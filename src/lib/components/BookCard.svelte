<script lang="ts">
	import { getUserState, type Book } from '$lib/state/user-state.svelte';
	import StarRating from './StarRating.svelte';

	let userContext = getUserState();

	interface BookCardProps {
		book: Book;
	}

	let { book }: BookCardProps = $props();
	let bookStatus = $derived(
		book.finished_reading_on
			? 'Finished'
			: book.started_reading_on
				? 'Currently Reading'
				: 'Not Started'
	);

	async function updateDatabaseRating(newRating: number) {
		await userContext.updateBook(book.id, { rating: newRating });
	}
</script>

<a
	href={`/private/books/${book.id}`}
	class="book-card relative flex h-72 w-full min-w-96 max-w-96 flex-col overflow-hidden rounded-xl text-left text-white no-underline shadow-md"
>
	<div class="book-status absolute right-0 top-4 w-auto bg-cyan-900/50 px-2 py-1 bg-blend-multiply">
		<span>{bookStatus}</span>
	</div>
	<div class="book-cover absolute -z-10 h-full w-full">
		{#if book.cover_image}
			<img src={book.cover_image} alt={book.title} class="h-full w-full object-cover" />
		{/if}
	</div>
	<div class="book-info h-full w-full rounded-xl bg-black/50 p-[60px_16px_0_16px]">
		<h4 class="font-serif text-2xl font-bold">{book.title}</h4>
		<p class="mb-4 text-sm font-normal italic">{book.author}</p>
		<StarRating ratingValue={book.rating || 0} isReadOnly={false} {updateDatabaseRating} />
	</div>
</a>
