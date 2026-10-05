<script lang="ts">
  import { applyAction, enhance, deserialize } from "$app/forms";
  import { invalidateAll } from "$app/navigation";
  import { Completion } from "@ai-sdk/svelte";
  import { Svroller } from "svrollbar";
  import {
    P,
    Hr,
    Card,
    Label,
    Input,
    List,
    Li,
    Alert,
    Button,
    Spinner,
    Heading,
  } from "flowbite-svelte";
  import {
    CirclePlusSolid,
    ThumbsUpSolid,
    BrainOutline,
  } from "flowbite-svelte-icons";
  import type { ActionData, PageData } from "./$types";
  import type { ActionResult } from "@sveltejs/kit";
  export let data: PageData;
  export let form: ActionData;
  let isSaving: boolean = false;
  let itemForms: Record<string, HTMLFormElement> = {};
  let suggestionError = false;

  const suggestion = new Completion({
    api: "/api/smart-shopper",
    streamProtocol: "text",
    onError: () => {
      suggestionError = true;
    },
  });

  async function handleItemAddSubmit(event: SubmitEvent) {
    const formElement = event.currentTarget as HTMLFormElement | null;
    if (!formElement) return;

    const data = new FormData(formElement);
    data.append("listName", currentList.name);
    isSaving = true;
    const response = await fetch(formElement.action, {
      method: "POST",
      body: data,
    });
    const result: ActionResult = deserialize(await response.text());

    isSaving = false;

    // call the AI submission for completion
    await suggestion.handleSubmit();

    // reset input field
    const inputEl = document.getElementById(
      "itemInput"
    ) as HTMLInputElement | null;
    if (inputEl != null) {
      inputEl.value = "";
    }

    if (result.type === "success") {
      console.log("Item id added to list", result.data?.id);
      await invalidateAll();
    }

    applyAction(result);
  }

  $: currentList = data.savedList;
  $: listFinished =
    data.savedList.items.length != 0 &&
    data.savedList.items.every((item) => item.completed === true) &&
    data.savedList.isFinished;
</script>

{#if form?.error}
  <Alert color="red" dismissable>
    Error: {form?.error}
  </Alert>
{/if}

{#if listFinished}
  <Alert color="green" class="ml-3 mt-3 text-white">
    {#snippet icon()}<ThumbsUpSolid class="w-4 h-4" />{/snippet}
    <strong>Shopping List: {currentList.name} completed</strong>
  </Alert>
{/if}

<!-- Display items, Put on right hand side  -->
<div class="container">
  <Card class="ml-6 mt-3 w-full max-w-md">
    <Heading
      tag="h6"
      class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
      >Shopping List: {currentList.name}</Heading
    >
    <form
      method="POST"
      action="?/addItem"
      onsubmit={(event) => {
        event.preventDefault();
        handleItemAddSubmit(event);
      }}
    >
      <Label for="itemName" class="block mb-1 mt-6">
        <P italic>
          {#if isSaving}
            Adding item....
          {:else}
            Add new Item
          {/if}
        </P>
        <div
          class="justify-left items-center space-y-4 sm:flex sm:space-y-1 sm:space-x-1"
        >
          <Input
            size="sm"
            name="itemName"
            id="itemInput"
            placeholder="Item"
            bind:value={suggestion.input}
            required
          />
          <Button id="addItemBtn" type="submit" pill={true} class="!p-2">
            {#if isSaving}
              <Spinner class="mr-3" size="4" />
            {:else}
              <CirclePlusSolid class="w-4 h-4" />
            {/if}
          </Button>
        </div>
      </Label>
    </form>
    <Hr class="my-2" />
    <Svroller width="25rem" height="20rem" alwaysVisible={true}>
      <List tag="ul" class="mt-2 list-none text-gray-500 dark:text-gray-400">
        {#each currentList.items as item}
          <Li class="gap-3">
            <div
              class="justify-left items-center space-y-4 sm:flex sm:space-y-1 sm:space-x-1"
            >
              <form
                bind:this={itemForms[item.name]}
                method="POST"
                action="?/toggleItemCompleted&itemId={item.id}"
                use:enhance={({ formData, formElement }) => {
                  formData.append("listName", currentList.name);
                  formData.append("listId", currentList.id);
                  formData.append("itemName", item.name);
                  return async ({ result, update }) => {
                    if (result.type === "failure") {
                      await applyAction(result);
                    } else if (result.type === "success") {
                      console.log("Item id toggled: ", result.data?.id);
                    }
                    await update();
                  };
                }}
              >
                <input
                  type="checkbox"
                  checked={item.completed}
                  name="markItemComplete"
                  onclick={() => itemForms[item.name].requestSubmit()}
                />
              </form>

              <div class="ml-6 mr-3">
                {#if item.completed}
                  <p class="line-through text-md dark:text-gray-400">
                    {item.name}
                  </p>
                {:else}
                  <p class="text-md dark:text-gray-400">{item.name}</p>
                {/if}
              </div>

              <form
                method="POST"
                action="?/deleteItem&itemId={item.id}"
                use:enhance={({ formData }) => {
                  formData.append("listName", currentList.name);
                  formData.append("itemName", item.name);
                  return async ({ result, update }) => {
                    if (result.type === "failure") {
                      await applyAction(result);
                    } else if (result.type === "success") {
                      console.log("Item id deleted", result.data?.id);
                    }
                    await update();
                  };
                }}
              >
                <Button type="submit" size="xs" outline color="light">
                  ❌
                </Button>
              </form>
            </div>
          </Li>
        {/each}
      </List>
    </Svroller>
  </Card>

  <Card class="ml-6 mt-3 mr-3 w-full max-w-md h-full">
    {#if suggestionError}
      <Alert color="red" dismissable>
        Error getting Suggestions: {suggestion.error}
      </Alert>
    {/if}
    <section>
      <BrainOutline /> SmartShopper suggests:
      <div class="flex flex-col w-full max-w-md py-24 mx-auto stretch">
        <P italic weight="bold">
          {suggestion.completion}
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
