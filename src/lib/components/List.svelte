<script lang="ts">
	export let isCompleted: boolean;
	$: textDecoration = isCompleted ? 'line-through' : 'none';
</script>

<style>
    
</style>
