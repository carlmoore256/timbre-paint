<script lang="ts">
    import {
        audioContextStore,
        isPlayingStore,
        audioSourceStore,
    } from "../lib/stores/audioStore";
    import { MeydaAnalyzer } from "meyda/dist/esm/meyda-wa";
    import Meyda from "meyda";
    import type { MeydaFeaturesObject } from "meyda";

    const bufferSizeOptions = [
        64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384,
    ];

    export let bufferSize = 512;
    export let hopRatio = 0.5;
    export let numMfccCoefficients = 12;
    export let onCreateAnalyzer: (analyzer: MeydaAnalyzer) => void;
    // export let analyzerCallback: (features: Partial<MeydaFeaturesObject>) => void;

    let hopSliderValue = hopRatio * 8;

    $: if (bufferSizeOptions.indexOf(bufferSize) === -1) {
        bufferSize = 512;
    }

    $: hopSize = Math.floor(bufferSize * hopRatio);

    let meydaAnalyzer: MeydaAnalyzer | null = null;

    $: if ($audioContextStore && $audioSourceStore) {
        if (meydaAnalyzer) {
            meydaAnalyzer.stop();
            meydaAnalyzer = null;
        }
        meydaAnalyzer = Meyda.createMeydaAnalyzer({
            audioContext: $audioContextStore,
            source: $audioSourceStore,
            bufferSize,
            hopSize,
            // callback: analyzerCallback,
            featureExtractors: [
                "rms",
                "mfcc",
                "perceptualSpread",
                "loudness",
                "buffer",
            ],
            numberOfMFCCCoefficients: numMfccCoefficients,
        });
        onCreateAnalyzer(meydaAnalyzer);
        // if ($isPlayingStore) {
        //     meydaAnalyzer.start();
        // }
    }

    function setBufferSize(event: Event) {
        const range = event.target as HTMLInputElement;
        bufferSize = bufferSizeOptions[parseInt(range.value)];
    }

    function setHopRatio(event: Event) {
        const range = event.target as HTMLInputElement;
        hopRatio = parseFloat(range.value) / 8;
    }

    $: if ($isPlayingStore && meydaAnalyzer) {
        console.log("starting analyzer");
        meydaAnalyzer.start();
    } else if (meydaAnalyzer) {
        console.log("stopping analyzer");
        meydaAnalyzer.stop();
    }
</script>

<div>
    <form>
        <div class="p-2">
            <label for="bufferSize">Buffer Size</label>
            <input
                type="range"
                id="bufferSize"
                min="0"
                max={bufferSizeOptions.length - 1}
                value={bufferSizeOptions.indexOf(bufferSize)}
                class="range"
                step="1"
                on:input={setBufferSize}
            />
            <div class="w-full flex justify-between text-xs px-2">
                {#each bufferSizeOptions as option}
                    <span>|</span>
                {/each}
            </div>
        </div>

        <div class="p-2">
            <label for="hopRatio">Hop Ratio</label>
            <input
                type="range"
                id="bufferSize"
                min="1"
                max="8"
                value={hopSliderValue}
                class="range"
                step="1"
                on:input={setHopRatio}
            />
            <div class="w-full flex justify-between text-xs px-2">
                {#each Array.from({ length: 8 }) as _, i}
                    <span>|</span>
                {/each}
            </div>
        </div>
    </form>
</div>
