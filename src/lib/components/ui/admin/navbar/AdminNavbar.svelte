<script>
	import { enhance } from '$app/forms';
	import Icon from '@iconify/svelte';
	import Logo from '../../logo/Logo.svelte';

	let fullLinksOpen = $state(false);

	$effect(() => {
		if (fullLinksOpen) {
		}
	});
</script>

<nav
	class="bg-background-50 border-background-200 sticky top-0 z-10 flex min-h-14 items-center justify-between border-b px-4 py-2"
>
	<a class="flex items-center gap-2" href="/admin">
		<Logo height={25} />
		<span class="text-xl font-semibold">Dots auth</span>
	</a>
	<div class="navbar hidden gap-6 sm:flex">
		{@render links()}
	</div>
	<div class="flex sm:hidden">
		<button class="nav-button" onclick={() => (fullLinksOpen = true)}>
			<Icon icon="tabler:dots-vertical" width="24" height="24" />
		</button>
	</div>
</nav>
<nav
	class="{fullLinksOpen
		? 'flex'
		: 'hidden'} bg-background-50 full-links-nav absolute top-0 left-0 z-50 h-full w-full flex-col"
>
	<div class="flex items-center justify-between gap-2 px-4 py-4 sm:px-6">
		<Logo height={25} />
		<button class="nav-button" onclick={() => (fullLinksOpen = false)}>
			<Icon icon="tabler:x" width="24" height="24" />
		</button>
	</div>
	<div class="flex flex-1 flex-col gap-1 px-1 pb-1 sm:px-3 sm:pb-3">
		{@render links()}
	</div>
	<div class="px-4 py-4">
		<button class="nav-button w-full" onclick={() => (fullLinksOpen = false)}> Close </button>
	</div>
</nav>

{#snippet links()}
	<a class="nav-link" href="/admin" onclick={() => (fullLinksOpen = false)}>Dashboard</a>
	<a class="nav-link" href="/admin/apps" onclick={() => (fullLinksOpen = false)}>Applications</a>
	<a class="nav-link" href="/admin/users" onclick={() => (fullLinksOpen = false)}>Users</a>
	<form method="post" class="contents" action="/admin?/logout" use:enhance>
		<button class="nav-link cursor-pointer" onclick={() => (fullLinksOpen = false)}>Log out</button>
	</form>
{/snippet}

<style>
	@reference '../../../../../app.css';

	.navbar .nav-link {
		@apply hover:text-primary-200 block cursor-pointer text-base;
	}
	.nav-button,
	.full-links-nav .nav-link {
		@apply hover:bg-background-200 active:bg-background-100 inline cursor-pointer rounded-md p-1 transition-colors duration-100;
	}
	.full-links-nav button.nav-link,
	.full-links-nav .nav-link {
		@apply px-3 py-2 text-left text-lg font-medium;
	}
</style>
