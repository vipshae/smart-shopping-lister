<script lang="ts">
	import { enhance } from '$app/forms';
import type { PageData } from './$types';
	export let data: PageData;
	$: totalLists = data.lists;
	const deleteList = (name: string) => {
		console.log('Deleting list', name)
	}
</script>

<h1>My Saved Lists</h1>

{#each totalLists as list}
	<ol>
		<div>
			<form method="POST" action="?/deleteList" use:enhance>
				<input bind:checked={list.isFinished} type="checkbox" />
				<span class:checked={list.isFinished}><a href="/lists/{list.name}">{list.name}</a></span>
				<button class="delete_list" on:click={() => deleteList(list.name)}> <span> ❌ </span> </button>
			</form>
		</div>
	</ol>
{/each}
