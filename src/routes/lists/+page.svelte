<script lang="ts">
	import { enhance, applyAction } from '$app/forms';
	import type { ActionData, PageData } from './$types';
	import { AccordionItem, Accordion, Heading, Button, ButtonGroup, Alert, Modal, Label, Input } from 'flowbite-svelte';
  	import { ShoppingCartSolid, UserEditSolid, ShareNodesSolid } from 'flowbite-svelte-icons';
	export let data: PageData;
	export let form: ActionData;
	let formModal = false;
	let inputEmail = '';
</script>

{#if form?.error}
	<Alert color="red" dismissable>
		Error: {form?.error}
	</Alert>
{/if}

<Heading tag="h6" class="ml-3 mt-3">My Saved Shopping Lists</Heading>

{#each data.lists as list}
<Accordion>
	<AccordionItem>
		<span slot="header" class="text-base flex gap-2">
			<ShoppingCartSolid class="mt-0.5" />
			<span>
				{list.name}
			</span>
		</span>
		<p class="mb-2 text-gray-500 dark:text-gray-400">This list has {list.numOfItems} total items</p>
		<form method="POST" use:enhance>
			<ButtonGroup>
				<Button href="/lists/{list.name}" size="sm" outline color="blue">
					<UserEditSolid class="w-3 h-3 mr-2" />
					View/Edit List
				</Button>
				<Button type="submit" size="sm" outline color="red" formaction="?/deleteList&shoppingListId={list.id}">
					❌ Delete List
				</Button>
				<Button size="sm" outline color="green" on:click={() => (formModal = true)} formaction="?/shareList&shoppingListId={list.id}">
					<ShareNodesSolid class="w-3 h-3 mr-2" />
					Share List
				</Button>
			</ButtonGroup>
		</form>
	</AccordionItem>
</Accordion>

<form class="flex flex-col space-y-6" method="POST" action="?/shareList&shoppingListId={list.id}" use:enhance={({ formData, cancel }) => {
	formData.append("email", inputEmail);
	return async ({ result, update }) => {
		// After list creation
		if (result.type === 'failure') {
			await applyAction(result);
		} else if (result.type === 'success'){
			console.log('Success');
		}
		await update();
	};
}}>
	<Modal bind:open={formModal} size="xs" autoclose={false} class="w-full">
		<h6 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Enter recepient's email</h6>
		<Label class="space-y-2">
			<span>Email</span>
			<Input type="email" id="email" value={inputEmail} placeholder="name@company.com" required />
		</Label>
		<Button type="submit" class="w-full1" color="green">Share List</Button>
	</Modal>
</form>
{/each}

<style>
</style>