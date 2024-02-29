<script lang="ts">
    import AudioFilePicker from "./components/AudioFilePicker.svelte";
    import AudioPlayer from "./components/AudioPlayer.svelte";
    import { audioUrlStore } from "./lib/stores/audioStore";
    import TimbreCanvas from "./components/TimbreCanvas.svelte";
    import AudioAnalyzer from "./components/AudioAnalyzer.svelte";
    import OptionsPanel from "./components/OptionsPanel.svelte";
    // import type { MeydaFeaturesObject } from "meyda";
    import { MeydaAnalyzer } from "meyda/dist/esm/meyda-wa";
    import { MeydaAnalyzerModulationDataSource } from "./lib/audio/MeydaAnalyzerModulationDataSource";
    import { modulationDataRouterStore } from "./lib/stores/modulationDataRouterStore";
    import { isPlayingStore } from "./lib/stores/audioStore";
    import ModulationSourcePicker from "./components/ModulationSourcePicker.svelte";
    import type {
        ModulationAxisOptions,
        TimbreCanvasGlobalOptions,
    } from "./lib/types";
    import LogoOverlay from "./components/LogoOverlay.svelte";
    import AudioFiles from "./assets/audio-files.json";
    import { onMount } from "svelte";

    onMount(() => {
        $audioUrlStore = randomAudioFile();
    });

    function randomAudioFile() {
        const randomIndex = Math.floor(Math.random() * AudioFiles.length);
        return AudioFiles[randomIndex];
    }

    let axisOptions: ModulationAxisOptions = {
        xPos: "MFCC2",
        yPos: "MFCC1",
        hue: "MFCC2",
        opacity: "loudness",
        scale: "rms",
        globalScale: "none",
        velocityX: "MFCC3",
        velocityY: "MFCC4",
    };

    let globalOptions: TimbreCanvasGlobalOptions = {
        backgroundColor: "#222222",
        backgroundTransparency: 1,
        maxNodes: 900,
        scale: 0.3,
        gravitate: {
            active: true,
            type: "rope",
            ease: 0.1,
        },
        ageRate: 0.001,
        spawnThreshold: {
            source: "rms",
            threshold: 0.0,
        },
    };

    let canvasWidth: number = window.innerWidth;
    let canvasHeight: number = window.innerHeight;
    let hasPlayed: boolean = false;

    $: if ($isPlayingStore && !hasPlayed) {
        hasPlayed = true;
    }

    function onCreateAnalyzer(meydaAnalyzer: MeydaAnalyzer) {
        // we will add this modulationDataSource to the global list of sources
        let dataSource = new MeydaAnalyzerModulationDataSource(meydaAnalyzer);
        $modulationDataRouterStore.addSource("meyda", dataSource);
    }

    function onOptionsChange(options: ModulationAxisOptions) {
        axisOptions = options;
    }

    function handleResize() {
        canvasWidth = window.innerWidth;
        canvasHeight = window.innerHeight;
    }

    let triggerPlay: string;
</script>

<svelte:window on:resize={() => handleResize()} />

<main>
    <LogoOverlay
        isShowing={!hasPlayed}
        position={"center"}
        onClick={() => (triggerPlay = Date.now().toString())}
    />
    <div class="fixed w-1/4">
        <AudioPlayer audioUrl={$audioUrlStore} {triggerPlay} />
        <OptionsPanel title="Audio Analyzer" isExpanded={true}>
            <AudioAnalyzer {onCreateAnalyzer} isAnalyzing={$isPlayingStore} />
        </OptionsPanel>
        <OptionsPanel title="Modulation Source" isExpanded={false}>
            <ModulationSourcePicker {onOptionsChange} />
        </OptionsPanel>
    </div>
    <TimbreCanvas
        width={canvasWidth}
        height={canvasHeight}
        isPlaying={$isPlayingStore}
        {axisOptions}
        {globalOptions}
    />
    <AudioFilePicker />
</main>

<style>
</style>
