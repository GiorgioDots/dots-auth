<script lang="ts">
	import Icon from '@iconify/svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';

	interface HTMLInputAttributesWithLabel extends HTMLInputAttributes {
		label?: string;
		icon?: string;
	}

	let { label, icon, ...props }: HTMLInputAttributesWithLabel = $props();
</script>

<label class="relative flex flex-col">
	{#if icon}
		<Icon class="absolute top-0 left-0 ml-1 flex h-full items-center" {icon} height="1.4rem"></Icon>
	{/if}
	{#if label}
		<span>
			{label}
		</span>
	{/if}
	<input
		{...props}
		class="rounded-default bg-background-400 disabled:bg-background-300 focus:outline-primary-500 px-4 py-2 transition-[background] duration-100 focus:outline-2 focus:outline-offset-3 {icon
			? 'pl-8'
			: ''}"
	/>
</label>
