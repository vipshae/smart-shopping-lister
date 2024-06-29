<script lang="ts">
  import { page } from "$app/stores";
  import { Breadcrumb, BreadcrumbItem } from "flowbite-svelte";
  import { HomeOutline } from "flowbite-svelte-icons";
  $: activeUrl = $page.url.pathname;
</script>

<Breadcrumb aria-label="Solid background breadcrumb example" solid>
  <BreadcrumbItem href="/home" home>
    <svelte:fragment slot="icon">
      <HomeOutline class="w-4 h-4 mr-2" />
    </svelte:fragment>
  </BreadcrumbItem>
  <BreadcrumbItem href="/lists">My Saved Lists</BreadcrumbItem>
  {#if $page.data.savedList}
    <BreadcrumbItem href={activeUrl}>{$page.data.savedList.name}</BreadcrumbItem
    >
  {/if}
</Breadcrumb>

<slot />
