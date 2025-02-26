<script lang="ts">
	import AdminNavbar from '$lib/components/ui/admin/navbar/AdminNavbar.svelte';

	let { children } = $props();
</script>

<div class="relative flex h-full flex-col overflow-auto">
	<AdminNavbar></AdminNavbar>
	<main class="border-background-200 relative mx-auto w-full max-w-7xl flex-1 xl:border-x">
		{@render children?.()}
	</main>
</div>
