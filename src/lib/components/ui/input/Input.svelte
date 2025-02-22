<script lang="ts">
	import Icon from '@iconify/svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';

	interface HTMLInputAttributesWithLabel extends HTMLInputAttributes {
		label?: string;
		icon?: string;
	}

	let { label, icon, value = $bindable(), type, ...props }: HTMLInputAttributesWithLabel = $props();

	let hasFocus = $state(false);
	let _type = $state(type);
</script>

<label class="relative flex flex-col">
	{#if icon}
		<Icon
			class="absolute top-0 left-0 ml-1 flex h-full items-center {hasFocus
				? 'text-primary-500'
				: ''}"
			{icon}
			height="1.4rem"
		></Icon>
	{/if}
	{#if label}
		<span
			class="absolute top-0 left-0 px-4 pt-1 text-sm {hasFocus
				? 'text-primary-400'
				: 'text-text-300'}"
		>
			{label}
		</span>
	{/if}
	<input
		{...props}
		type={_type}
		bind:value
		class="rounded-default bg-background-300 disabled:bg-background-200 focus:outline-primary-500 placeholder:text-background-600 px-4 py-2 transition-[background] duration-100 focus:outline-2 focus:outline-offset-3 {icon
			? 'pl-8'
			: ''}  {label ? 'pt-6' : ''} {type == 'password' ? 'pr-8' : ''}"
		onfocus={() => (hasFocus = true)}
		onblur={() => (hasFocus = false)}
	/>
	{#if type == 'password'}
		<Icon
			class="absolute top-0 right-0 mr-1 flex h-full cursor-pointer items-center"
			icon={_type == 'password' ? 'tabler:eye' : 'tabler:eye-off'}
			height="1.4rem"
			onclick={() => {
				_type = _type == 'password' ? 'text' : 'password';
			}}
		></Icon>
	{/if}
</label>
