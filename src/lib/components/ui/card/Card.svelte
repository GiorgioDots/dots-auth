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

<div class="{classes} bg-background-100 rounded-default p-2 border-1 border-primary-300">
	{@render children?.()}
</div>

<style>

</style>