<script lang="ts">
	import { scale } from "svelte/transition";

	let { children, open, onclose }: { children: any; open?: boolean; onclose?: () => void } =
		$props();
</script>

{#if open}
	<div  class="absolute top-0 left-0 z-20 h-full w-full">
		<div
			class="bg-background-50 absolute top-0 left-0 h-full w-full opacity-60"
			onclick={() => onclose?.()}
			onkeypress={(event) => onclose?.()}
			role="button"
			tabindex="0"
		></div>
		<div transition:scale={{duration: 100}} class="modal">
			{@render children?.()}
		</div>
	</div>
{/if}

<style>
	@reference '../../../../../app.css';
	.modal {
		@apply bg-background-200 rounded-default absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform p-4;
	}
</style>
