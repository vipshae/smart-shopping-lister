<script>
	/** @type {import('./$types').PageData} */
	export let data;
	let shoppingLists = Object.keys(data.savedLists);
</script>

<h1>My Saved Lists</h1>

{#each shoppingLists as list}
	<ol>
		<div>
			<a href="/lists/{list}">{list}</a>
		</div>
	</ol>
{/each}
