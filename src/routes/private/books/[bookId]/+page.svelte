<script lang="ts">
	import { getUserState, type Book } from '$lib/state/user-state.svelte.js';
	import { StarRating } from '$components';
	import Button from '$components/Button.svelte';
	import Icon from '@iconify/svelte';
	import Dropzone from 'svelte-file-dropzone';

	interface BookPageProps {
		data: {
			book: Book;
		};
	}

	let { data }: BookPageProps = $props();
	let userContext = getUserState();
	let book = $derived(userContext.getBookById(data.book.id) || data.book);
	let isEditMode = $state(false);

	let title = $state(data.book.title);
	let author = $state(data.book.author);
	let description = $state(data.book.description || '');
	let genre = $state(data.book.genre || '');
	function goBack() {
		window.history.back();
	}

	async function toggleEditModeAndSaveToDatabase() {
		if (isEditMode) {
			await userContext.updateBook(book.id, { title, author, description, genre });
		}
		isEditMode = !isEditMode;
	}

	async function updateReadingStatus() {
		const hasStartedReading = Boolean(book.started_reading_on);
		const currentTimestamp = new Date().toISOString();

		if (hasStartedReading) {
			// book.id
			// take the book and update it {started_reading_on: current_date}
			await userContext.updateBook(book.id, { finished_reading_on: currentTimestamp });
		} else {
			await userContext.updateBook(book.id, { started_reading_on: currentTimestamp });
		}
	}

	async function updateDatabaseRating(newRating: number) {
		await userContext.updateBook(book.id, { rating: newRating });
	}

	async function handleDrop(e: CustomEvent<any>) {
		const { acceptedFiles } = e.detail;

		if (acceptedFiles.length) {
			const file = acceptedFiles[0] as File;

			await userContext.uploadBookCover(file, book.id);
		}
	}
</script>

{#snippet bookInfo()}
	<h2 class="mt-8 text-6xl font-bold">{book.title}</h2>
	<p class="text-sm text-gray-500">by {book.author}</p>

	<h4 class="mb-2 mt-4 font-semibold">Your rating</h4>
	<StarRating ratingValue={book.rating || 0} {updateDatabaseRating} />
	<p class="mt-2 text-sm text-gray-500">Click to {book.rating ? 'change' : 'give'} your rating</p>

	{#if book.description}
		<h4 class="mb-2 mt-4 font-semibold">Description</h4>
		<p class="mb-4 text-sm text-gray-500">{book.description}</p>
	{:else}
		<h4 class="mb-2 mt-4 font-semibold">No description available</h4>
		<button class="btn btn-primary mb-4" onclick={() => console.log('Add description')}>
			Add description
		</button>
	{/if}

	{#if !book.finished_reading_on}
		<Button isSecondary={Boolean(book.started_reading_on)} onclick={() => updateReadingStatus()}>
			{book.started_reading_on ? 'I finished reading this book' : 'I started reading this book'}
		</Button>
	{/if}

	{#if book.genre}
		<h4 class="mb-2 mt-4 font-semibold">Genre</h4>
		<p class="text-sm text-gray-500">{book.genre}</p>
	{/if}
{/snippet}

{#snippet editFields()}
	<form action="">
		<input
			type="text"
			name="title"
			bind:value={title}
			class="input input-title mb-2 mt-4 w-full px-1 py-2 font-serif text-6xl font-bold"
		/>
		<div class="input-author flex items-center">
			<p class="mr-2">by</p>
			<input
				type="text"
				name="author"
				bind:value={author}
				class="input input-author flex items-center"
			/>
		</div>
		<h4 class="mb-2 mt-4 font-semibold">Your rating</h4>
		<StarRating ratingValue={book.rating || 0} {updateDatabaseRating} />
		<p class="mt-2 text-sm text-gray-500">Click to {book.rating ? 'change' : 'give'} your rating</p>
		<h4 class="mb-2 mt-4 font-semibold">Description</h4>
		<textarea
			name="description"
			placeholder={'Give a description'}
			bind:value={description}
			class="textarea mb-4 w-full px-1 py-2"
			rows={5}
		></textarea>
		{#if !book.finished_reading_on}
			<Button isSecondary={Boolean(book.started_reading_on)} onclick={() => updateReadingStatus()}>
				{book.started_reading_on ? 'I finished reading this book' : 'I started reading this book'}
			</Button>
		{/if}
		<h4 class="mb-2 mt-4 font-semibold">Genre</h4>
		<input type="text" name="genre" bind:value={genre} class="input input-genre" />
	</form>
{/snippet}

<div class="book-page">
	<button onclick={goBack} aria-label="Go back">
		<Icon icon="ep:back" width={40} />
	</button>
	<div class="book-container flex justify-start gap-12">
		<div class="book-info w-1/2">
			{#if isEditMode}
				{@render editFields()}
			{:else}
				{@render bookInfo()}
			{/if}
			<div class="button-container mt-4 flex gap-4">
				<Button isSecondary={true} onclick={toggleEditModeAndSaveToDatabase}>
					{isEditMode ? 'Save changes' : 'Edit'}
				</Button>
				<Button isDanger={true} onclick={() => userContext.deleteBook(book.id)}>
					Delete from library
				</Button>
			</div>
		</div>
		<div
			class="book-cover flex min-h-96 w-1/2 max-w-md items-center justify-center overflow-hidden rounded-2xl border border-black"
		>
			{#if book.cover_image}
				<img
					src={book.cover_image}
					alt={book.title}
					class="h-full w-full rounded-[inherit] object-cover"
				/>
			{:else}
				<Dropzone
					on:drop={handleDrop}
					multiple={false}
					accept="image/*"
					maxSize={5 * 1024 * 1024}
					containerClasses={'dropzone-cover h-full w-full items-center justify-center'}
				>
					<Icon icon="bi:camera-fill" width={40} />
					<p>Add cover image</p>
				</Dropzone>
			{/if}
		</div>
	</div>
</div>
