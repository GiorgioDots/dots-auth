<script lang="ts">
	import Button from '$lib/components/ui/button/Button.svelte';
	import Icon from '@iconify/svelte';
	import type { PageServerData } from './$types';
	import { goto } from '$app/navigation';

	let { data }: { data: PageServerData } = $props();
	const { applications } = data;
</script>

<header class="bg-background-100 sticky top-0 z-10 flex items-center justify-between">
	<h1 class="text-lg">Applications</h1>
	<Button onclick={() => goto('apps/new')}>
		<Icon icon="tabler:plus"></Icon>
	</Button>
</header>
{#each applications as app}
	<div>{app.name}</div>
{/each}
