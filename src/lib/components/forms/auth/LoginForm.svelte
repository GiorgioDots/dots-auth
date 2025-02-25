<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/ui/button/Button.svelte';
	import Card from '$lib/components/ui/card/Card.svelte';
	import Input from '$lib/components/ui/input/Input.svelte';
	import Logo from '$lib/components/ui/logo/Logo.svelte';
	import type { Application } from '$lib/server/db/schema';

	let { afterSubmit, goToRegister }: { afterSubmit?: () => void; goToRegister?: () => void } =
		$props();
	let login = $state('');
	let password = $state('');
</script>

<div class="flex h-full items-center justify-center p-4">
	<Card classes="w-full max-w-sm">
		<Logo height={75} classes="mx-auto mb-2" />
		<h1 class="mb-0 text-center text-xl">Hello 人間どの</h1>
		<h2 class="text-text-200 text-center text-sm">Insert your credentials to login</h2>
		<form
			method="POST"
			action="?/login"
			use:enhance={() => {
				return async ({ update }) => {
					await update();
					afterSubmit?.();
				};
			}}
			class="mt-3 flex w-full flex-col gap-4"
		>
			<Input name="login" type="login" placeholder="Login" bind:value={login} required />
			<Input
				name="password"
				type="password"
				placeholder="Password"
				bind:value={password}
				required
			/>
			<Button type="submit">Login</Button>
			<button class="link self-auto" type="button" onclick={() => goToRegister?.()}>No account?</button>
		</form>
		<!-- <p class="text-error mt-2">{form?.message ?? ''}</p> -->
	</Card>
</div>
