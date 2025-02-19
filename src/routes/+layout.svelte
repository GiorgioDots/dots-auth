<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<div class="h-full selection:bg-secondary-500 selection:text-on-secondary">
	{@render children()}
</div>
