<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import Button from '$lib/components/ui/button/Button.svelte';
	import Input from '$lib/components/ui/input/Input.svelte';
	import type { PageServerData } from './$types';

	let { data }: { data: PageServerData } = $props();
	console.log(data.app);
</script>

<Button onclick={() => goto('/admin/apps')}>BACK</Button>
<h1 class="text-lg">Create new Application</h1>
<form
	method="POST"
	action="?/create"
	use:enhance={() => {
		return async ({ update }) => {
			await update();
		};
	}}
>
	<Input name="name" />
</form>
