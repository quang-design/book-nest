<script lang="ts">
	interface StarRatingProps {
		isReadOnly?: boolean;
		ratingValue: number;
		updateDatabaseRating?: (newRating: number) => void;
	}

	let { isReadOnly, ratingValue, updateDatabaseRating }: StarRatingProps = $props();

	function handleRating(newRating: number) {
		ratingValue = newRating;

		if (updateDatabaseRating) {
			updateDatabaseRating(newRating);
		}
	}
</script>

<div
	class="rating"
	role={isReadOnly ? 'img' : 'group'}
	aria-label={isReadOnly ? `Rated ${ratingValue} out of 5 stars` : 'Rate this book'}
	aria-readonly={isReadOnly}
>
	<div class="rating-container inline-flex outline-none">
		{#each Array(5) as _, i}
			<button
				type="button"
				class="star cursor-pointer border-none bg-none p-0 text-3xl outline-none"
				aria-label={isReadOnly ? `Rated ${i + 1} out of 5 stars` : `Rate ${i + 1} out of 5 stars`}
				aria-pressed={!isReadOnly && ratingValue > 1}
				onclick={(e) => {
					e.preventDefault();
					handleRating(i + 1);
				}}
				disabled={isReadOnly}
			>
				<span
					class="star-icon inline-block
                    hover:text-yellow-400/50
                    {ratingValue >= i + 1
						? 'text-yellow-400'
						: 'text-gray-300/50 bg-blend-multiply'}"
				>
					★
				</span>
			</button>
		{/each}
	</div>
</div>
