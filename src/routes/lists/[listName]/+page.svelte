<script lang="ts">
    import { applyAction, enhance, deserialize } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { useCompletion } from 'ai/svelte';
    import { P, Hr, Card, Label, Input, List, Li, Alert, Button, Spinner } from 'flowbite-svelte';
	import { PlusSolid, ThumbsUpSolid } from 'flowbite-svelte-icons';
	import type { PageData } from './$types';
	import type { ActionResult } from '@sveltejs/kit';
	export let data: PageData;
	let isSaving: boolean = false;
	let form: { [key: string]: HTMLFormElement; } = {};

	const { completion, input, stop, error, handleSubmit } = useCompletion(
		{
			api: '../api/smart-shopper'
		}
	);

	async function handleItemAddSubmit(event : { currentTarget: EventTarget & HTMLFormElement}) {
		const data = new FormData(event.currentTarget);
		data.append("listName", currentList.name);
		isSaving = true;
		const response = await fetch(event.currentTarget.action, {
			method: 'POST',
			body: data,
		});
		const result: ActionResult = deserialize(await response.text());

		isSaving = false;

		// call the AI submission for completion
		handleSubmit(event);

		const inputEl = document.getElementById("itemInput") as HTMLInputElement | null;
		if(inputEl != null) {
			// reset input field
			inputEl.value = '';
		}

		if (result.type === 'success') {
			console.log('Item id added to list', result.data?.id)			
			await invalidateAll();
		}

		applyAction(result);
	}

	$: currentList = data.savedList;
	$: listFinished = data.savedList.items.length != 0
		&& data.savedList.items.every(item => item.completed === true)
		&& data.savedList.isFinished;

</script>

{#if form?.error}
	<Alert color="red" dismissable>
		Error: {form?.error}
	</Alert>
{/if}

{#if listFinished}
	<Alert color="none" class="ml-3 mt-3 bg-green-500 text-white"><strong>Shopping List: {currentList.name} completed</strong> <ThumbsUpSolid slot="icon" class="w-4 h-4" /></Alert>
{/if}


<!-- Display items, Put on right hand side  -->
<div class="container">
	<Card class="ml-3 mt-3 w-full max-w-md">
		<h7 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">List Items for {currentList.name}:</h7>
		<List tag="ul" list="none" class="mt-2 text-gray-500 dark:text-gray-400">
			{#each currentList.items as item}
				<Li class="gap-3">
					<div class="justify-left items-center space-y-4 sm:flex sm:space-y-1 sm:space-x-1">
						<form bind:this={form[item.name]} method="POST" action="?/toggleItemCompleted&itemId={item.id}" use:enhance={({ formData, formElement }) => {
							formData.append("listName", currentList.name);
							formData.append("listId", currentList.id);
							formData.append("itemName", item.name);
							return async ({ result, update }) => {
								if (result.type === 'failure') {
									await applyAction(result);
								} else if (result.type === 'success') {
									console.log('Item id toggled: ', result.data?.id)
								}
								await update();
							}
						}}>
							<input type="checkbox" checked={item.completed}  name="markItemComplete" on:click={() => form[item.name].requestSubmit()}/>
						</form>
	
						<div class="ml-6 mr-3">
							{#if item.completed}
								<p class="line-through text-md dark:text-gray-400">{item.name}</p>
							{:else}
								<p class="text-md dark:text-gray-400">{item.name}</p>
							{/if}
							
						</div>
	
						<form method="POST" action="?/deleteItem&itemId={item.id}" use:enhance={({ formData }) => {
							formData.append("listName", currentList.name);
							formData.append("itemName", item.name);
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
							<Button type="submit" size="xs" outline color="light">
								❌
							</Button>
						</form>
					</div>
				</Li>
			{/each}
		</List>
		<Hr classHr="my-2" />
		<form method="POST" action="?/addItem" on:submit|preventDefault={handleItemAddSubmit}>
			<Label for="itemName" class="block mb-1 mt-6">
				<P italic>
					{#if isSaving}
						Adding item....
					{:else}
						Enter new Item
					{/if}
				</P>
				<div class="justify-left items-center space-y-4 sm:flex sm:space-y-1 sm:space-x-1">
					<Input 
						size: FormSizeType="sm:text-lg"
						label="item"
						name="itemName"
						id="itemInput"
						placeholder="Item"
						bind:value={$input}
						required
					/>
					<Button id="addItemBtn" type="submit" pill={true} class="!p-2">
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
	
	<Card class="ml-3 mt-3 mr-3 w-full max-w-md">
		<section>
			Smart ListerBot suggests purchasing:
			<div class="flex flex-col w-full max-w-md py-24 mx-auto stretch">
				<P italic weight="bold">
					{$completion}
				</P>
			</div>
		</section>
	</Card>
</div>


<style>
	.container {
		display: flex;
	}
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}
</style>