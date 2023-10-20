<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<h1>Displaying contents of Shopping List: {data.savedList.name}</h1>
{#each data.savedList.items as item}
	<ol>
		<input bind:checked={item.completed} type="checkbox" />
		<span class:checked={item.completed}>{item.name}</span>
	</ol>
{/each}
