<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/ui/button/Button.svelte';
	import Card from '$lib/components/ui/card/Card.svelte';
	import Input from '$lib/components/ui/input/Input.svelte';
	import Logo from '$lib/components/ui/logo/Logo.svelte';
	import type { PageServerData } from './$types';

	let { data }: { data: PageServerData } = $props();
	let loading = $state(false);
	let form = $state({
		username: 'asberatbh',
		password: 'aenbhesdafthbedfsht',
		email: 'asdf@asdf',
        clientId: data.app.clientId,
        customRedirectUri: data.customRedirect
	});
</script>

<div class="h-full w-full content-center p-4">
	<Card classes="mx-auto max-w-md p-4 border">
		<div class="pb-4">
			<Logo height={75} classes="mx-auto mb-2" />
			<h1 class="mb-0 text-center text-xl">Welcome to {data.app.name}</h1>
			<h2 class="text-text-200 text-center text-sm">Insert the information below to sign up!</h2>
		</div>
		<form
			method="POST"
			action="?/signup"
			class="flex flex-col gap-4"
			use:enhance={() => {
				loading = true;
                let formCopy = $state.snapshot(form);
				return async ({ update }) => {
					await update();
					loading = false;
                    form = formCopy;
				};
			}}
		>
			<input name="clientId" type="text" bind:value={form.clientId} class="hidden" />
			<input name="customRedirectUri" type="text" bind:value={form.customRedirectUri} class="hidden" />
			<Input
				type="email"
				name="email"
				required
				icon="tabler:mail"
				placeholder="Your email"
				disabled={loading}
				bind:value={form.email}
			/>
			<Input
				name="username"
				icon="tabler:user-filled"
				placeholder="Your username"
				disabled={loading}
				bind:value={form.username}
			/>
			<Input
				type="password"
				name="password"
				icon="tabler:key"
				minlength={12}
				placeholder="Password"
				disabled={loading}
				bind:value={form.password}
			/>
			<Button {loading}>SIGN UP</Button>
		</form>
	</Card>
</div>
