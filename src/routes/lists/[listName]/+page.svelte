<script lang="ts">
    import { applyAction, enhance } from '$app/forms';
    import { Heading, Card, Label, Input, Checkbox, Button, Spinner, Listgroup, ListgroupItem } from 'flowbite-svelte';
	import { PlusSolid } from 'flowbite-svelte-icons';
	import type { PageData } from './$types';
	export let data: PageData;
	let isSaving: boolean = false;
	let form: { [key: string]: HTMLFormElement; } = {};

	$: currentList = data.savedList;
	$: listFinished = data.savedList.items.length != 0 
		&& data.savedList.items.every(item => item.completed === true)
		|| data.savedList.isFinished;

</script>

{#if listFinished}
	<Heading tag="h6" class="ml-3 mt-3 line-through dark:text-gray-400">Shopping List: {currentList.name} completed</Heading>
{/if}


<!-- Display items, Put on right hand side  -->

<Card class="w-full max-w-md">
	<h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">List Items:</h5>
	<Listgroup items={currentList.items} let:item class="w-79">
		<ListgroupItem>
			<div class="justify-left items-center space-y-4 sm:flex sm:space-y-1 sm:space-x-1">
				<form bind:this={form[item.name]} method="POST" action="?/toggleItemCompleted&itemId={item.name}" use:enhance={({ formData, formElement }) => {
					formData.append("listName", currentList.name);
					return async ({ result, update }) => {
						if (result.type === 'failure') {
							await applyAction(result);
						} else if (result.type === 'success') {
							console.log('Item id toggled: ', result.data?.id)
						}
						await update();
					}
				}}>
					<input type="checkbox" checked={item.completed}  name="markItemComplete" on:change={() => form[item.name].requestSubmit()}/>
				</form>

				<div class="ml-6 mr-3">
					{item.name}
				</div>

				<form method="POST" action="?/deleteItem&itemId={item.name}" use:enhance={({ formData }) => {
					formData.append("listName", currentList.name);
					return async ({ result, update }) => {
						if (result.type === 'failure') {
							await applyAction(result);
						} else if (result.type === 'success') {
							console.log('Item id deleted', result.data?.id)
						}
						await update();
					};
				}
				}>
					<button>
						<span> ❌ </span> 
					</button>
				</form>
			</div>

		</ListgroupItem>
	
	</Listgroup>
	<form method="POST" action="?/addItem" use:enhance={({ formData, formElement }) => {
		formData.append("listName", currentList.name);
		isSaving = true;
		formElement.reset();
		return async ({ result, update }) => {
			isSaving = false;
			if (result.type === 'failure') {
				await applyAction(result);
			} else if (result.type === 'success') {
				console.log('Item id added to list', result.data?.id)
			}
			await update();
		};
	}}>

		<Label class="block mb-2 mt-4">
			{isSaving? 'Adding item...' : 'Enter new Item'}
			<div lass="justify-left items-center space-y-4 sm:flex sm:space-y-1 sm:space-x-1">
				<Input 
					size: FormSizeType="sm:text-sm"
					label="item"
					name="itemName"
					placeholder="new Item"
					required
				/>
				<Button type="submit" pill={true} class="!p-2">
					{#if isSaving}
						<Spinner class="mr-3" size="4" color="white" />
					{:else}
						<PlusSolid class="w-4 h-4" />
					{/if}
				</Button>
			</div>

		</Label>

	</form>
</Card>


<!-- {#each currentList.items as item}
	<ol class="list-items">
		<form bind:this={form[item.name]} method="POST" action="?/toggleItemCompleted&itemId={item.name}" use:enhance={({ formData, formElement }) => {
			formData.append("listName", currentList.name);
			return async ({ result, update }) => {
				if (result.type === 'failure') {
					await applyAction(result);
				} else if (result.type === 'success') {
					console.log('Item id toggled: ', result.data?.id)
				}
				await update();
			}
		}}>
			<input type="checkbox" bind:checked={item.completed} name="markItemComplete" on:click|preventDefault={() => form[item.name].requestSubmit()}/>
			<span class:checked={item.completed}>{item.name}</span>
		</form>
		<form method="POST" action="?/deleteItem&itemId={item.name}" use:enhance={({ formData }) => {
			formData.append("listName", currentList.name);
			return async ({ result, update }) => {
				if (result.type === 'failure') {
					await applyAction(result);
				} else if (result.type === 'success') {
					console.log('Item id deleted', result.data?.id)
				}
				await update();
			};
		}
		}>
			<button>
				<span> ❌ </span> 
			</button>
		</form>
	</ol>
{/each} -->


<style>
</style>