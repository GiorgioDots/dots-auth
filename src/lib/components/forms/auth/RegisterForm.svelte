<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/ui/button/Button.svelte';
	import Card from '$lib/components/ui/card/Card.svelte';
	import Input from '$lib/components/ui/input/Input.svelte';
	import Logo from '$lib/components/ui/logo/Logo.svelte';

	let { afterSubmit, goToLogin }: { afterSubmit?: () => void; goToLogin?: () => void } = $props();
	let username = $state('');
	let email = $state('');
	let password = $state('');
</script>

<div class="flex h-full items-center justify-center p-4">
	<Card classes="w-full max-w-sm">
		<Logo height={75} classes="mx-auto mb-2" />
		<h1 class="mb-0 text-center text-xl">Sign up</h1>
		<h2 class="text-text-200 text-center text-sm">Insert the information below to sign up</h2>
		<form
			method="POST"
			action="?/register"
			use:enhance={() => {
				return async ({ update }) => {
					await update();
					afterSubmit?.();
				};
			}}
			class="mt-3 flex w-full flex-col gap-4"
		>
			<Input
				name="username"
				type="username"
				placeholder="Username"
				bind:value={username}
				required
				icon="tabler:user-filled"
			/>
			<Input
				name="email"
				type="email"
				placeholder="Email"
				bind:value={email}
				required
				icon="tabler:mail"
			/>
			<Input
				name="password"
				type="password"
				placeholder="Password"
				bind:value={password}
				required
				icon="tabler:key"
			/>
			<Button type="submit">SIGN UP</Button>
			<div class="flex justify-end pb-2">
				<button class="link" type="button" onclick={() => goToLogin?.()}>
					Already have an account?
				</button>
			</div>
		</form>
	</Card>
</div>
