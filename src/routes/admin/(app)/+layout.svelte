<script lang="ts">
	import AdminNavbar from '$lib/components/ui/admin/navbar/AdminNavbar.svelte';

	let { children } = $props();
</script>

<div class="relative flex flex-col h-full overflow-auto">
	<AdminNavbar></AdminNavbar>
	<main class="w-full border-background-200 relative mx-auto max-w-7xl flex-1 xl:border-x">
		{@render children?.()}
	</main>
</div>
