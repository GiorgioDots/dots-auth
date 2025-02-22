<script lang="ts">
	import type { PageServerData } from './$types';

	let { data }: { data: PageServerData } = $props();
    console.log(data)
</script>

{#each data.users as user}
    <div>
        {user.users.email} - {user.users.email} - {user.users.isAdmin}
        
    </div>
{/each}