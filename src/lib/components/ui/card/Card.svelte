<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		children,
		classes
	}: {
		children: Snippet<[]> | undefined;
		classes?: string;
	} = $props();
</script>

<div class="{classes} bg-background-100 rounded-default border-primary-300 border-1 p-2">
	{@render children?.()}
</div>

<style>
</style>
