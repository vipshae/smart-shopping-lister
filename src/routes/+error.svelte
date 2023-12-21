<script lang="ts">
	import { page } from '$app/stores';
    import { Alert } from 'flowbite-svelte';
</script>

{#if $page.error}
    <Alert color="red" dismissable>
        Error: {$page.error.message}
    </Alert>
{/if}