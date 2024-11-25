<script lang="ts">
	import type { Snippet } from 'svelte';

	interface BasicProps {
		children: Snippet;
		isSecondary?: boolean;
		isDanger?: boolean;
		isMenu?: boolean;
	}

	interface ButtonProps extends BasicProps {
		onclick?: (e: MouseEvent) => void;
		href?: never;
		type?: 'button' | 'submit';
	}

	interface LinkProps extends BasicProps {
		href: string;
		onclick?: never;
	}

	type ComponentProps = ButtonProps | LinkProps;

	let { children, href, onclick, isSecondary, isDanger, isMenu, ...props }: ComponentProps =
		$props();
</script>

{#if href}
	<a
		{href}
		class="button text-decoration-none hover:text-decoration-none block"
		class:is-secondary={isSecondary}
		class:is-danger={isDanger}
		class:is-menu={isMenu}
	>
		{@render children()}
	</a>
{:else}
	<button
		{...props}
		{onclick}
		class="button"
		class:is-secondary={isSecondary}
		class:is-danger={isDanger}
		class:is-menu={isMenu}
	>
		{@render children()}
	</button>
{/if}

<style>
	.button {
		padding: 12px 24px;
		width: 100%;
		min-width: 230px;
		text-align: center;
		border-radius: 12px;
		background-color: black;
		border: 1px solid white;
		color: white;
		font-weight: normal;
		font-size: 22px;
	}

	.is-secondary {
		background-color: white;
		border: 1px solid black;
		color: black;
	}

	.is-danger {
		background-color: red;
		border-color: red;
		color: white;
	}

	.is-menu {
		min-width: 120px;
		padding: 8px 16px;
		font-size: 16px;
		border-radius: 8px;
	}

	@media (max-width: 640px) {
		.button {
			min-width: 100%;
		}
	}
</style>
