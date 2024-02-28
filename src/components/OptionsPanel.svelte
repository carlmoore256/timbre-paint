<script lang="ts">
    export let title: string | null = null;
</script>

<div
    class="flex flex-col space-x-2 m-2 bg-primary-content p-2 rounded-md border-solid border-neutral-content border bg-opacity-50 backdrop-blur-md"
>
    {#if title}
        <h2 class="text-md font-bold p-2 mb-2">{title}</h2>
    {/if}
    <slot />
</div>
