<script lang="ts">
	import Icon from '@iconify/svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	interface HTMLButtonAttributesWithColor extends HTMLButtonAttributes {
		color?: 'primary' | 'secondary';
		loading?: boolean;
	}
	let { color, loading, children, disabled, ...buttonprops }: HTMLButtonAttributesWithColor = $props();

	if (color == undefined) color = 'primary';
	let colorClasses = {
		primary: 'bg-primary-500 text-on-primary hover:bg-primary-600 focus:outline-primary-500 disabled:bg-primary-500',
		secondary:
			'bg-secondary-500 text-on-secondary hover:bg-secondary-600 focus:outline-secondary-500 disabled:bg-secondary-500',
	};
</script>

<button
	{...buttonprops}
	class="{buttonprops.class} {colorClasses[
		color
	]} block rounded-default cursor-pointer px-4 py-2 transition-[background] duration-100 focus:outline-2 focus:outline-offset-3 disabled:cursor-not-allowed  disabled:text-text-300 disabled:opacity-80"
	disabled={loading || disabled}
>
	<span class="flex items-center justify-center gap-2">
		{#if loading}
			<Icon icon="tabler:loader-2" class="animate-spin" height="1.4rem"></Icon>
		{/if}
		{@render children?.()}
	</span>
</button>
