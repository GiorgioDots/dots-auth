<script lang="ts">
	import { enhance } from '$app/forms';
	import LoginForm from '$lib/components/forms/auth/LoginForm.svelte';
	import RegisterForm from '$lib/components/forms/auth/RegisterForm.svelte';
	import type { ActionData, PageServerData } from './$types';

	let { data, form }: { data: PageServerData; form: ActionData } = $props();
	const { user, params, app } = data;
	let loggedUser = $state(user);

	$effect(() => {
		$inspect(form?.user)
	})

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
		{app}
	/>
{/if}
{#if loggedUser}
	do you authorize the app {app.name}?
	<button>Yes</button>
	<button>No</button>
	<form
		action="?/logout"
		method="POST"
		use:enhance={() => {
			return async ({ update }) => {
				await update();
				if (!form?.user) {
					loggedUser = null;
				}
			};
		}}
	>
		<button>Change Account</button>
	</form>
{/if}
