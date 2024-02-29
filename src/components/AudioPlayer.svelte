<script lang="ts">
    import Icon from "@iconify/svelte";

    import {
        isPlayingStore,
        audioContextStore,
    } from "../lib/stores/audioStore";
    import { onMount } from "svelte";

    export let audioUrl: string | null = null;
    export let loop = true;
    export let triggerPlay: string;

    let audioElement: HTMLAudioElement;
    let progressValue = 0;

    $: triggerPlay, playAudio();

    onMount(() => {
        // bind spacebar to play/pause
        window.addEventListener("keydown", (event) => {
            if (event.code === "Space") {
                event.preventDefault();
                if ($isPlayingStore) {
                    pauseAudio();
                } else {
                    playAudio();
                }
            }
        });
    });

    function playAudio() {
        if (audioElement && audioUrl && $audioContextStore) {
            audioElement.play();
            $isPlayingStore = true;
            $audioContextStore.resume();
        }
    }

    function pauseAudio() {
        if (audioElement && audioUrl) {
            audioElement.pause();
            $isPlayingStore = false;
        }
    }

    function updateProgress() {
        if (audioElement) {
            if (audioElement.duration === NaN) {
                progressValue = 0;
                return;
            }
            progressValue = (audioElement.currentTime / audioElement.duration) * 100 || 0;
        }
    }

    function seekAudio(event: MouseEvent) {
        const progressBar = event.target as HTMLProgressElement;
        const rect = progressBar.getBoundingClientRect();
        const percent = (event.clientX - rect.left) / rect.width;
        if (audioElement) {
            audioElement.currentTime = percent * audioElement.duration;
        }
    }

    $: if (audioElement) {
        audioElement.ontimeupdate = updateProgress;
        if (!$audioContextStore) {
            audioContextStore.createFromAudioElement(audioElement);
        }
    }
</script>

<div
    class="flex items-center space-x-2 m-2 bg-primary-content p-2 rounded-md border-solid border-neutral-content border bg-opacity-50 backdrop-blur-md"
>
    <button
        class="p-2 bg-primary text-white rounded flex items-center justify-center w-10 h-5"
        on:click={$isPlayingStore ? pauseAudio : playAudio}
    >
        {#if $isPlayingStore}
            <Icon icon="mdi:pause" />
        {:else}
            <Icon icon="mdi:play" />
        {/if}
    </button>

    <audio bind:this={audioElement} src={audioUrl} {loop}></audio>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
    <progress
        class="progress w-full cursor-pointer"
        value={progressValue}
        max="100"
        on:click={seekAudio}
    ></progress>
</div>
