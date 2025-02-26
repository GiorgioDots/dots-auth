<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/ui/button/Button.svelte';
	import Card from '$lib/components/ui/card/Card.svelte';
	import Input from '$lib/components/ui/input/Input.svelte';
	import Logo from '$lib/components/ui/logo/Logo.svelte';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
	let loading = $state(false);
</script>

<div class="flex h-full items-center justify-center p-4">
	<Card classes="w-full max-w-sm">
		<Logo height={75} classes="mx-auto mb-2" />
		<h1 class="mb-0 text-center text-xl">Hello 人間どの</h1>
		<h2 class="text-text-200 text-center text-sm">Insert your credentials to login</h2>
		<form
			data-sveltekit-keepfocus
			method="post"
			action="?/login"
			use:enhance={() => {
				loading = true;
				return async ({ update }) => {
					await update();
					loading = false;
				};
			}}
			class="mt-3 flex w-full flex-col gap-4"
		>
			<Input disabled={loading} icon="tabler:user-filled" name="username" />
			<Input disabled={loading} icon="tabler:key" type="password" name="password" />
			<Button type="submit" disabled={loading} {loading}>Login</Button>
			<!-- <Button formaction="?/register">Register</Button> -->
		</form>
		<p class="text-error mt-2">{form?.message ?? ''}</p>
	</Card>
</div>
