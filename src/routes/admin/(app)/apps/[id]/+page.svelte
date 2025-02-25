<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import Button from '$lib/components/ui/button/Button.svelte';
	import Input from '$lib/components/ui/input/Input.svelte';
	import Icon from '@iconify/svelte';
	import type { ActionData, PageServerData } from './$types';

	let { data, form }: { data: PageServerData; form: ActionData } = $props();
	$effect(() => {
		formData = data.app;
	});
	let formData = $state(data.app);

	let isNew = $derived(() => {
		return data.app.id == '';
	})
</script>

<div class="flex h-full flex-col gap-4 p-2">
	<div class="flex items-center gap-4">
		<Button onclick={() => goto('/admin/apps')}>
			<Icon icon="tabler:caret-left-filled" />
		</Button>
		<h1 class="text-lg">{isNew() ? 'Create new' : 'Edit'} Application</h1>
	</div>
	<div class="flex flex-col gap-4 md:flex-row">
		<form
			class="mx-auto flex w-full flex-col gap-4 md:flex-1 md:max-w-md"
			method="POST"
			action="?/createupdate"
			use:enhance={() => {
				return async ({ update }) => {
					await update();
					if (form?.app) {
						if (isNew()) {
							goto(`/admin/apps/${form?.app.id}`);
						} else {
							formData = form.app;
						}
					}
				};
			}}
		>
			<input name="id" bind:value={formData.id} class="hidden" />
			<Input name="name" label="Application name" bind:value={formData.name} required />
			<Input name="clientId" label="Client Id" bind:value={formData.clientId} required />
			<Input name="clientSecret" label="Client Secret" bind:value={formData.clientSecret} required />
			<Input
				name="tokenExpirationSeconds"
				label="Token Expiration Seconds"
				type="number"
				required
				min={60}
				max={86400}
				bind:value={formData.tokenExpirationSeconds}
			/>
			<Input
				name="refreshTokenExpirationSeconds"
				label="Refresh Token Expiration Seconds"
				type="number"
				required
				min={60}
				bind:value={formData.refreshTokenExpirationSeconds}
			/>
			<div class="flex gap-4">
				{#if !isNew()}
					<Button type="button" color="secondary" class="flex-1">Reload</Button>
				{/if}
				<Button type="submit" class="flex-1">Save</Button>
			</div>
		</form>
		{#if !isNew()}
			<div class="md:flex-1">users</div>
		{/if}
	</div>
</div>
