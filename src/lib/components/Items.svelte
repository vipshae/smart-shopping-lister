<script lang="ts">
    export let completed: boolean;
    export let name: string;
</script>

<form method="POST" action="?/toggleItemCompleted&itemId={name}">
    <input bind:checked={completed} type="checkbox" />
    <span class:checked={completed}>{name}</span>
</form>
<form method="POST" action="?/removeItem&itemId={name}">
    <button>
        <span> ❌ </span> 
    </button>
</form>
<style>
</style>