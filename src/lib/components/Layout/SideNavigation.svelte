<script>
	import Icon from '@iconify/svelte';
</script>

<nav
	class="side-navigation sticky top-0 flex h-screen flex-none border-r border-gray-300 pl-[calc(4vw+1rem)] pr-10"
>
	<ul class="flex h-full flex-col items-center justify-center">
		<li>
			<a href="/private/dashboard">
				<Icon icon="ion:library-outline" width={'40'} />
			</a>
		</li>
		<li>
			<a href="/private/scan-shelf">
				<Icon icon="solar:eye-scan-linear" width={'40'} />
			</a>
		</li>
		<li>
			<a href="/private/settings">
				<Icon icon="ion:settings-outline" width={'40'} />
			</a>
		</li>
	</ul>
</nav>

<style>
	.side-navigation li:not(:last-of-type) {
		@apply mb-4;
	}
</style>
