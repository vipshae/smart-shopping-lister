<script>
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
</script>

<main>
	<!-- Form -->
	<form>
		<input bind:value={newItem} placeholder="Enter an item to buy" />
		<button class="add-item" on:click={addItem}><span>+</span></button>
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
	</div>
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
		align-items: left;
		min-height: 100%;
		padding: 5vmin;
		box-sizing: border-box;
		background: antiquewhite;
	}
	form {
		width: 100%;
		max-width: 200px;
		display: flex;
		align-items: center;
		margin-bottom: 1rem;
	}
	.items {
		max-width: 300px;
	}
	.checked {
		text-decoration: line-through;
		color: slategray;
	}

	button:hover {
		background: lightseagreen;
	}
	button:focus {
		outline: none;
	}
</style>
