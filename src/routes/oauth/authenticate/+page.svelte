<script lang="ts">
	import { enhance } from '$app/forms';
	import LoginForm from '$lib/components/forms/auth/LoginForm.svelte';
	import RegisterForm from '$lib/components/forms/auth/RegisterForm.svelte';
	import Button from '$lib/components/ui/button/Button.svelte';
	import Card from '$lib/components/ui/card/Card.svelte';
	import Logo from '$lib/components/ui/logo/Logo.svelte';
	import type { ActionData, PageServerData } from './$types';

	let { data, form }: { data: PageServerData; form: ActionData } = $props();
	const { user, params, app } = data;

	let currparams = $state(params);
	let loggedUser = $state(user);
	let register = $state(false);
</script>

{#if loggedUser == null && !register}
	<LoginForm
		afterSubmit={() => {
			if (form?.user) loggedUser = form.user;
		}}
		goToRegister={() => (register = true)}
	/>
{/if}
{#if loggedUser == null && register}
	<RegisterForm
		afterSubmit={() => {
			if (form?.user) loggedUser = form.user;
		}}
		goToLogin={() => (register = false)}
	/>
{/if}
{#if loggedUser}
	<div class="flex h-full items-center justify-center p-4">
		<Card classes="w-full max-w-sm flex flex-col gap-4">
			<Logo height={75} classes="mx-auto mb-2" />
			<h1 class="mb-0 text-center text-xl">Authorize <span class="font-bold">{app.name}</span></h1>
			<h2 class="text-text-200 text-center">
				Do you want to link your account to the app <span class="font-bold">{app.name}</span>?
			</h2>
			<span> </span>
			<div class="flex gap-4">
				<div class="flex-1">
					<Button
						class="w-full"
						color="error"
						onclick={() => {
							window.location.href = `${currparams.redirect_uri}?state=${currparams.state}&status=cancelled`;
						}}>NO</Button
					>
				</div>
				<form
					class="flex-1"
					method="POST"
					action="?/connect"
					use:enhance={() => {
						return async ({ update }) => {
							await update();
						};
					}}
				>
					<div class="hidden">
						<input name="client_id" type="text" bind:value={currparams.client_id} />
						<input name="redirect_uri" type="text" bind:value={currparams.redirect_uri} />
						<input name="state" type="text" bind:value={currparams.state} />
						<input name="code_challenge" type="text" bind:value={currparams.code_challenge} />
					</div>
					<Button class="w-full">YES</Button>
				</form>
			</div>
			<form
				action="?/logout"
				method="POST"
				class="flex justify-end"
				use:enhance={() => {
					return async ({ update }) => {
						await update();
						if (!form?.user) {
							loggedUser = null;
						}
					};
				}}
			>
				<button class="link">Change Account</button>
			</form>
		</Card>
	</div>
{/if}
