<script lang="ts">
	import Button from '$lib/components/ui/button/Button.svelte';
	import Icon from '@iconify/svelte';
	import type { PageServerData } from './$types';
	import { goto } from '$app/navigation';

	let { data }: { data: PageServerData } = $props();
	const { applications } = data;
</script>

<header
	class="bg-background-50 sticky top-[56px] z-10 flex min-h-[2rem] items-center justify-between p-2"
>
	<h1 class="text-lg">Applications</h1>
	<Button onclick={() => goto('apps/new')}>
		<Icon icon="tabler:plus" height="18"></Icon>
	</Button>
</header>
<div class="flex flex-col gap-2 p-2 pt-0">
	{#each applications as app}
		<a
			href="apps/{app.id}"
			class="rounded-default hover:bg-background-100 border-background-200 border p-2 pt-0 transition-colors duration-100"
		>
			<div class="truncate font-semibold">
				{app.name}
			</div>
			<div class="text-background-600 truncate text-xs">
				Client Id: <span class="font-semibold">{app.clientId}</span>
			</div>
			<div class="text-background-600 truncate text-xs">
				Client Secret: <span class="font-semibold">{app.clientSecret}</span>
			</div>
		</a>
	{/each}
</div>
