<script>
	import { SideNavigation } from '$components';
	let { children } = $props();
</script>

<div class="auth-area flex h-screen overflow-hidden">
	<SideNavigation />
	<div class="main-area min-w-0 flex-1 overflow-y-auto p-[40px_4vw_100px_40px]">
		{@render children()}
	</div>
</div>
