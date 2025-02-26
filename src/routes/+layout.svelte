<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<div class="selection:bg-secondary-500 selection:text-on-secondary h-full">
	{@render children()}
</div>
