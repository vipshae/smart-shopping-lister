<script>
	import { error } from '@sveltejs/kit';
	/** @type {import('./$types').PageData} */
	export let data;

	const { slug, savedLists } = data;
	if (!Object.prototype.hasOwnProperty.call(savedLists, slug)) {
		throw error(404, 'Not found');
	}
	/**
	 * @type {any}
	 */
	let listData = savedLists[slug];
</script>

<h1>Shopping List: {slug}</h1>
{#each listData as itemObj}
	<ol>
		<input bind:checked={itemObj.completed} type="checkbox" />
		<span class:checked={itemObj.completed}>{itemObj.itemName}</span>
	</ol>
{/each}
