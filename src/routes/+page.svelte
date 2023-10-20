<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import type { ActionData } from './$types';
	import { page } from '$app/stores';
	
	let isSaving = false;
	let isSaved = false;
	let shoppingListName: string;
	export let form: ActionData;
	$: console.log($page.form, $page.status)

</script>

<svelte:head>
  <title>Shopping Lister App 📝</title>
</svelte:head>

{#if form?.error}
	<p class="error">{form?.error}</p>
{/if}

{#if isSaved && shoppingListName}
	<p class="success">Shopping List {shoppingListName} saved successfully!</p>
	<form method="POST" action="?/addItems&shoppingListId={shoppingListName}">
		<button class="add-items" type="submit">Add Items</button>
	</form>
{/if}

<main>
	<!-- Form -->
	<form method="POST" action="?/createList" use:enhance={({ form, data }) => {
		// Before form submission to server, optimistic UI
		isSaving = true;
		isSaved = false;
		form.reset();
		return async ({ result, update }) => {
			// After list creation
			isSaving = false;
			if (result.type === 'failure') {
				await applyAction(result);
			} else {
				isSaved = true;
				shoppingListName = result.data.listName;
			}
			await update();
		};
	}}>
		<!-- create a new shopping list Form -->
		<label>
			{isSaving? 'Saving list...' : 'Enter name of Shopping List'}
			<input 
				name="shoppingListName" 
				value={form?.shoppingListName ?? ''}
				disabled={isSaving}
				required
			/>
			<button class="add-shoppingList" type="submit">Create List</button>
		</label>
	</form>

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

	.error {
		color:darkred;
	}
	.success {
		color:green;
	}

	button:hover {
		background: lightseagreen;
	}
	button:focus {
		outline: none;
	}
</style>
