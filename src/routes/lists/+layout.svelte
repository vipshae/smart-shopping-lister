<script lang="ts">
  import { page } from "$app/state";
  import type { Snippet } from "svelte";
  import { Breadcrumb, BreadcrumbItem } from "flowbite-svelte";
  let { children }: { children: Snippet } = $props();
  const activeUrl = $derived(page.url.pathname);
</script>

<Breadcrumb aria-label="Solid background breadcrumb example" solid>
  <BreadcrumbItem href="/home" home>Home</BreadcrumbItem>
  <BreadcrumbItem href="/lists">My Saved Lists</BreadcrumbItem>
  {#if page.data.savedList}
    <BreadcrumbItem href={activeUrl}>{page.data.savedList.name}</BreadcrumbItem
    >
  {/if}
</Breadcrumb>

{@render children()}
