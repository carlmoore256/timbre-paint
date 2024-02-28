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
    
    $audioUrlStore = "TriskelionHyperop.mp3";

    function onCreateAnalyzer(meydaAnalyzer: MeydaAnalyzer) {
        // we will add this modulationDataSource to the global list of sources
        const dataSource = new MeydaAnalyzerModulationDataSource(meydaAnalyzer);
        console.log("keys", dataSource.getKeys());

        // setInterval(() => {
        //     console.log("keys", dataSource.getValue("MFCC0"));
        // }, 100);
    }
</script>

<main>
    <AudioPlayer audioUrl={$audioUrlStore} />
    <OptionsPanel title="Audio Analyzer">
        <AudioAnalyzer {onCreateAnalyzer} />
    </OptionsPanel>
    <TimbreCanvas width={window.innerWidth} height={window.innerHeight} />
    <AudioFilePicker />
</main>

<style>
</style>
