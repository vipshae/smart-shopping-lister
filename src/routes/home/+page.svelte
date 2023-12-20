<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
    import { goto } from '$app/navigation';
	import type { ActionData, PageData } from './$types';
	import { Button, Label, Input, Spinner, Alert, GradientButton, Heading } from 'flowbite-svelte';
	let isSaving = false;
	let isSaved = false;
	let shoppingListName: string| unknown;
	export let form: ActionData;
	export let data: PageData;

	const gotoHome = async () => {
		isSaved = false;
		await goto("/home", {
			invalidateAll: true
		})
	}
</script>

{#if form?.error}
	<Alert color="red" dismissable>
		Error: {form?.error}
	</Alert>
{/if}

{#if isSaved && shoppingListName}
	<Alert color="green">
		<div class="flex items-center gap-3 mb-3">
			<span class="text-lg font-medium">Shopping List <strong>{shoppingListName}</strong> created successfully!</span>
		</div>
		<div class="flex items-center">
			<form method="POST" action="?/addItems&shoppingListId={shoppingListName}">
				<Button size="xs" color="green" type="submit">Add Items</Button>
			</form>
			<Button on:click={gotoHome} size="xs" outline color="green" class="dark:text-green-800">Go to Home</Button>
		</div>
	</Alert>
{:else}
<span class="welcomeText">
	<Heading tag="h6" class="ml-3 mt-3 mb-3">
		<strong>Welcome {data?.session?.user?.name ?? "Admin"}</strong>
	</Heading>
</span>
<main>
	<!-- Form -->
	<form method="POST" action="?/createList" use:enhance={({ formElement, formData }) => {
		// Before form submission to server, optimistic UI
		isSaving = true;
		isSaved = false;
		formElement.reset();
		formData.append("user", data?.session?.user?.name ?? "Admin");
		return async ({ result, update }) => {
			// After list creation
			isSaving = false;
			if (result.type === 'failure') {
				await applyAction(result);
			} else if (result.type === 'success'){
				isSaved = true;
				shoppingListName = result.data?.listName;
			}
			await update();
		};
	}}>
		<!-- create a new shopping list Form -->
		<div class="flex flex-col space-y-2">
			<div>
				<Label class="leading-relaxed dark:text-gray-400">
					{isSaving? 'Saving list...' : 'Enter name of Shopping List'}
				</Label>
			</div>
			<div>
				<Input 
					name="shoppingListName" 
					value={form?.shoppingListName ?? ''}
					disabled={isSaving}
					required
					size: FormSizeType="sm:text-xs"
				/>
			</div>
			<div>
				<GradientButton size="sm" shadow color="blue" type="submit"> 
					{#if isSaving}
						<Spinner class="mr-3" size="4" color="white" />
						Creating...
					{:else}
						Create List
					{/if}
				</GradientButton>
			</div>
		</div>

	</form>
</main>
{/if}



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
</style>
