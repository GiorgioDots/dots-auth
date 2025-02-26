<script lang="ts">
	import type { PageServerData } from './$types';

	let { data }: { data: PageServerData } = $props();
</script>

{#each data.users as user}
	<div>
		{user.users.username} - {user.users.email} - {user.users.isAdmin}
	</div>
{/each}
