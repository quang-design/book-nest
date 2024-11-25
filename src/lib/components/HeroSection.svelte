<script lang="ts">
	import heroImage from '$assets/hero.png';
	import { Button } from '$components';
</script>

<section
	class="mx-auto mb-8 mt-10 block max-w-7xl items-center justify-between p-4 sm:flex sm:flex-row"
>
	<div class="hero-text flex flex-col items-start gap-4 pr-10">
		<h1>Book Nest</h1>
		<h3>Your personal book library</h3>
		<h4 class="mt-4">
			Create your very own digital library where you can keep track of all your favorite books you
			own, read and love
		</h4>
		<h4 class="mb-4">
			Our app offers a beautiful UI, easy to use interface that makes managing your book collection
			a joy
		</h4>
		<Button href="/register">Sign up</Button>
	</div>
	<img
		src={heroImage}
		alt="Cozy study desk with stacked vintage books, reading glasses, a desk lamp, and decorative plants"
		class="hero-image w-full sm:w-1/2"
	/>
</section>
