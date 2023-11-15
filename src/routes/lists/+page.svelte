<script lang="ts">
	import { enhance, applyAction } from '$app/forms';
	import type { ActionData, PageData } from './$types';
	import { AccordionItem, Accordion, Heading, Button, ButtonGroup } from 'flowbite-svelte';
  	import { ShoppingCartSolid, UserEditSolid, CheckOutline } from 'flowbite-svelte-icons';
	export let data: PageData;
	export let form: ActionData;
</script>

{#if form?.error}
	<p class="error">{form?.error}</p>
{/if}

<Heading tag="h6" class="ml-3 mt-3">My Saved Shopping Lists</Heading>

{#each data.lists as list}
<Accordion>
	<AccordionItem>
		<span slot="header" class="text-base flex gap-2">
			<ShoppingCartSolid class="mt-0.5" />
			<span>
				{#if list.isFinished}
					<span style:text-decoration="line-through">
						{list.name}
					</span>
				{:else}
					<span>
						{list.name}
					</span>
				{/if}
			</span>
		</span>
		<p class="mb-2 text-gray-500 dark:text-gray-400">This list has {list.numOfItems} total items</p>
		<form method="POST" use:enhance>
			<ButtonGroup>
				<Button href="/lists/{list.name}" size="sm" outline color="blue">
					<UserEditSolid class="w-3 h-3 mr-2" />
					Edit List
				</Button>
				<Button type="submit" size="sm" outline color="red" formaction="?/deleteList&shoppingListId={list.name}">
					❌ Delete List
				</Button>
			</ButtonGroup>
		</form>



	</AccordionItem>
</Accordion>

<!-- <div>
	<form method="POST">
		{#if list.isFinished}
			<span style:text-decoration="line-through">
				<a href="/lists/{list.name}">{list.name}</a>
			</span>
		{:else}
			<span>
				<a href="/lists/{list.name}">{list.name}</a>
			</span>
		{/if}
		<button class="delete_list" formaction="?/deleteList&shoppingListId={list.name}">
			<span> ❌ </span> 
		</button>
	</form>
</div> -->
{/each}

<style>
	.error {
		color:darkred;
	}
	ol {
		padding: 10px;
		margin-left: 35px;

	}
</style>