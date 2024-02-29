<script lang="ts">
    import { fade } from "svelte/transition";
    export let iconSrc: string = "logo.svg";
    export let isShowing: boolean = true;
    export let position:
        | "center"
        | "top-right"
        | "top-left"
        | "bottom-right"
        | "bottom-left";
    export let onClick: () => void;

    let content: HTMLElement;

    $: positionClass = {
        "center": "items-center justify-center",
        "top-right": "items-end justify-start",
        "top-left": "items-start justify-start",
        "bottom-right": "items-end justify-end",
        "bottom-left": "items-start justify-end",
    }[position] || "items-start justify-start";
</script>

{#if isShowing}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div
        class="flex flex-col fixed z-50 w-full h-full {positionClass}"
        transition:fade={{ duration: 600, delay: 300 }}
        bind:this={content}
        on:click={onClick}
    >
        <img src={iconSrc} alt="logo" class="w-1/5" />
        <h1 class="text-4xl font-bold">Timbre Paint</h1>
        <h4 class="text-lg">Click or press space to start</h4>
    </div>
{/if}
