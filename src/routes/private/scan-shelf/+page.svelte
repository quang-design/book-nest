<script lang="ts">
	import Button from '$components/Button.svelte';
	import { convertFileToBase64 } from '$lib/utils/openai-helpers';
	import Icon from '@iconify/svelte';
	import Dropzone from 'svelte-file-dropzone';
	import { getUserState, type OpenAIBook } from '$lib/state/user-state.svelte';

	let userContext = getUserState();
	let isLoading = $state(false);
	let errorMessage = $state('');
	let recognizedBooks = $state<OpenAIBook[]>([]);
	let bookSuccessfullyAdded = $state(false);

	async function handleDrop(e: CustomEvent<any>) {
		const { acceptedFiles } = e.detail;

		if (acceptedFiles.length) {
			isLoading = true;
			const fileToSendToOpenAI = acceptedFiles[0];
			const base64String = await convertFileToBase64(fileToSendToOpenAI);

			try {
				const response = await fetch('/api/scan-shelf', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						base64: base64String
					})
				});

				const { bookArray } = (await response.json()) as { bookArray: OpenAIBook[] };

				recognizedBooks = bookArray;
			} catch (error) {
				errorMessage = 'Error processing the uploaded file.';
			}
		} else {
			errorMessage =
				"Could not upload given image file. Are you sure it's an image with a file size less than 10MB?";
		}
	}

	function removeBook(index: number) {
		recognizedBooks.splice(index, 1);
	}

	async function addAllBooks() {
		isLoading = true;
		try {
			await userContext.addBooksToLibrary(recognizedBooks);
		} catch (error: any) {
			errorMessage = error.message;
		} finally {
			isLoading = false;
			bookSuccessfullyAdded = true;
		}
	}
</script>

<h2 class="mb-8 mt-4">Take a picture to add books</h2>

{#if recognizedBooks.length === 0}
	<div class="upload-area flex justify-center">
		<div class="upload-container max-w-2xl">
			{#if errorMessage}
				<h4 class="mb-2 flex w-full flex-col items-center text-center text-red-500">
					{errorMessage}
				</h4>
			{/if}
			{#if isLoading}
				<div class="spinner-container flex">
					<div
						class="spinner mr-2 inline-block h-8 w-8 animate-spin rounded-full border-4 border-black/10 border-l-black"
					></div>
					<p>Processing your image...</p>
				</div>
			{:else}
				<Dropzone
					on:drop={handleDrop}
					multiple={false}
					accept="image/*"
					maxSize={10 * 1024 * 1024}
					containerClasses={'dropzone-cover dropzone-books flex flex-col items-center justify-center min-w-[600px] min-h-[400px] flex-0 cursor-pointer'}
				>
					<Icon icon="bi:camera-fill" width={40} />
					<p>Drag a picture here or click to select a file</p>
				</Dropzone>
			{/if}
		</div>
	</div>
{:else if !bookSuccessfullyAdded}
	<div class="found-books">
		<ul>
			<table class="book-list mb-4 w-full border-collapse rounded-lg bg-white">
				<thead>
					<tr>
						<th>Title</th>
						<th>Author</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					{#each recognizedBooks as book, index}
						<tr>
							<td>{book.bookTitle}</td>
							<td>{book.author}</td>
							<td>
								<button
									type="button"
									aria-label="Remove book"
									class="btn btn-error text-red-500"
									onclick={() => removeBook(index)}
								>
									<Icon icon="bi:trash" width={24} />
								</button>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
			<Button onclick={() => addAllBooks()}>Add all books</Button>
		</ul>
	</div>
{:else}
	<div class="success-message">
		<h3>The selected {recognizedBooks.length} books have been added to your library.</h3>
		<Button href="/private/dashboard">Go to your library</Button>
	</div>
{/if}

<style>
	.book-list th {
		@apply border-b-[3px] border-black px-4 py-2 text-left text-2xl;
	}

	.book-list td {
		@apply border-b border-[#cdcdcd] px-4 py-3 text-2xl;
	}

	.book-list tr:last-child td {
		@apply border-b-0;
	}
</style>
