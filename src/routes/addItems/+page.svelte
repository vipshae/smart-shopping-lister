<script lang="ts">
	import type { ShoppingListType, ItemType } from '../lib/server/types/types';
	import { enhance } from '$app/forms';
	
	let newItem = '';
	let count = 0;
	/**
	 * @type {any[]}
	 */
	let ItemList = [];
	function addItem() {
		ItemList = [
			...ItemList,
			{
				id: count,
				itemName: newItem,
				completed: false
			}
		];
		newItem = '';
	}

	$: count = ItemList.length;
	$: remainingItems = ItemList.filter((item) => !item.completed).length;

	/**
	 * @param {number} index
	 */
	function deleteItem(index) {
		ItemList.splice(index, 1);
		ItemList = ItemList;
	}

	function clearCompleted() {
		ItemList = ItemList.filter((item) => !item.completed);
	}

	function saveList() {
		console.log('Saving list');
	}
</script>


<main>
    <form method="post">
		<input name="newItem" placeholder="Enter an item to buy" />
		<button class="add-item"><span>+</span></button>
	</form>
	
	<h1>My Shopping List</h1>
	<div class="items">
		{#each ItemList as item, index}
			<input bind:checked={item.completed} type="checkbox" />
			<span class:checked={item.completed}>{item.itemName}</span>
			<button class="delete_item" on:click={() => deleteItem(index)}> <span> ❌ </span> </button>
			<br />
		{/each}
		<p>Total number of remaining Items to buy: {remainingItems}</p>
		<div>
			<button on:click={clearCompleted}>Clear Completed Items</button>
		</div>
		{#if remainingItems !== 0}
			<div>
				<button on:click={saveList}>Save List</button>
			</div>
		{/if}
	</div>
</main>