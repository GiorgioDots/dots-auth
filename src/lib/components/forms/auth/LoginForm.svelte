<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/ui/button/Button.svelte';
	import Card from '$lib/components/ui/card/Card.svelte';
	import Input from '$lib/components/ui/input/Input.svelte';
	import Logo from '$lib/components/ui/logo/Logo.svelte';

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
			<Input
				name="login"
				type="login"
				placeholder="Username or email"
				bind:value={login}
				required
				icon="tabler:user-filled"
			/>
			<Input
				name="password"
				type="password"
				placeholder="Password"
				bind:value={password}
				required
				icon="tabler:key"
			/>
			<Button type="submit">LOGIN</Button>
			<div class="flex justify-end pb-2">
				<button class="link" type="button" onclick={() => goToRegister?.()}>
					Don't have an account?
				</button>
			</div>
		</form>
	</Card>
</div>
