<script lang="ts">
	import { AuthForm } from '$components';

	let { form } = $props();
</script>

<AuthForm isRegister={true} {form} />
