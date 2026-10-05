<script lang="ts">
  import { page } from "$app/stores";
  import { Breadcrumb, BreadcrumbItem } from "flowbite-svelte";
  $: activeUrl = $page.url.pathname;
</script>

<Breadcrumb aria-label="Solid background breadcrumb example" solid>
  <BreadcrumbItem href="/home" home>Home</BreadcrumbItem>
  <BreadcrumbItem href="/lists">My Saved Lists</BreadcrumbItem>
  {#if $page.data.savedList}
    <BreadcrumbItem href={activeUrl}>{$page.data.savedList.name}</BreadcrumbItem
    >
  {/if}
</Breadcrumb>

<slot />
