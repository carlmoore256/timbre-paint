<script lang="ts">
    import { slide } from "svelte/transition";
    import Icon from "@iconify/svelte";

    export let title: string | null = null;
    export let isExpanded: boolean = true;

    // <!-- on:click={() => (expanded = !expanded)} -->
    //
</script>

<div
    class="flex flex-col space-x-2 m-2 bg-primary-content p-2 rounded-md border-solid border-neutral-content border bg-opacity-50 backdrop-blur-md"
>
    {#if title}
        <h2 class="text-md font-bold p-2 mb-2">{title}</h2>
    {/if}

    <button
        class="absolute top-3 right-3 "
        on:click={() => (isExpanded = !isExpanded)}
    >
        {#if isExpanded}
            <Icon icon="ic:sharp-expand-less" />
        {:else}
            <Icon icon="ic:sharp-expand-more" />
        {/if}
    </button>

    {#if isExpanded}
        <div class="flex flex-col space-y-2" transition:slide>
            <slot />
        </div>
    {/if}
</div>
