<script>
	import Button from "$lib/components/ui/button/Button.svelte";
	const handleThemeToggle = () => {
		const html = document.querySelector("html");
		html?.classList?.toggle("dark");
		localStorage.theme = html?.classList?.contains("dark") ? "dark" : "light";
	};
</script>
<a class="link" href="/admin">login</a>
<Button onclick={handleThemeToggle}>Test</Button>