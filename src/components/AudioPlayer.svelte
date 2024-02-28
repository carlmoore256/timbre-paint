<script lang="ts">
    import Icon from "@iconify/svelte";

    import { isPlayingStore, audioContextStore } from "../lib/stores/audioStore";
    import { onMount } from "svelte";

    export let audioUrl: string | null = null;
    export let loop = true;

    let audio: HTMLAudioElement | null = null;
    let progressValue = 0;

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
        if (audio && audioUrl) {
            audio.play();
            $isPlayingStore = true;
            $audioContextStore.resume();
        }
    }

    function pauseAudio() {
        if (audio && audioUrl) {
            audio.pause();
            $isPlayingStore = false;
        }
    }

    function updateProgress() {
        if (audio) {
            if (audio.duration === NaN) {
                progressValue = 0;
                return;
            }
            progressValue = (audio.currentTime / audio.duration) * 100;
        }
    }

    function seekAudio(event: MouseEvent) {
        const progressBar = event.target as HTMLProgressElement;
        const rect = progressBar.getBoundingClientRect();
        const percent = (event.clientX - rect.left) / rect.width;
        if (audio) {
            audio.currentTime = percent * audio.duration;
        }
    }

    $: if (audio) {
        audio.ontimeupdate = updateProgress;
        audioContextStore.createFromAudioElement(audio);
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

    <audio bind:this={audio} src={audioUrl} {loop}></audio>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
    <progress
        class="progress w-full cursor-pointer"
        value={progressValue}
        max="100"
        on:click={seekAudio}
    ></progress>
</div>
