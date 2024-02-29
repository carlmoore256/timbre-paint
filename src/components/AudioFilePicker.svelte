<script lang="ts">
    import {
        audioUrlStore,
        isPlayingStore,
    } from "../lib/stores/audioStore";

    let audioUrl: string | null = null;
    let audio: HTMLAudioElement | null = null;
    
    function handleFileChange(event: Event) {
        const target = event.target as HTMLInputElement;
        const file = target.files?.[0];
        if (file) {
            if ($audioUrlStore) {
                // Revoke the previous object URL to avoid memory leaks
                URL.revokeObjectURL($audioUrlStore);
            }
            $audioUrlStore = URL.createObjectURL(file);
        }
    }

    function playAudio() {
        if (audio) {
            audio.play();
            $isPlayingStore = true;
        }
    }

    function pauseAudio() {
        if (audio) {
            audio.pause();
            $isPlayingStore = false;
        }
    }
</script>

<div class="fixed bottom-5 right-3">
    <input
        type="file"
        class="file-input file-input-bordered file-input-primary w-full max-w-xs"
        accept="audio/*"
        on:change={handleFileChange}
    />

    {#if audioUrl}
        <div class="flex items-center space-x-2">
            <button
                class="p-2 bg-blue-500 text-white rounded"
                on:click={$isPlayingStore ? pauseAudio : playAudio}
            >
                {$isPlayingStore ? "Pause" : "Play"}
            </button>
            <audio bind:this={audio} src={audioUrl} class="hidden"></audio>
        </div>
    {/if}
</div>
