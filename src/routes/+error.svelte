<script lang="ts">
	import { page } from '$app/stores';
</script>

{#if $page.error}
    <h2>{$page.error.message}</h2>
{/if}