<script lang="ts">
    import type { ModulationAxisOptions } from "../lib/types";
    import ModulationValueSelector from "./ModulationValueSelector.svelte";

    let options: ModulationAxisOptions = {
        xPos: "MFCC0",
        yPos: "MFCC1",
        hue: "MFCC2",
        opacity: "MFCC3",
        scale: "MFCC4",
        globalScale: "none",
        velocityX: "MFCC5",
        velocityY: "MFCC6",
    };

    export let onOptionsChange: (options: ModulationAxisOptions) => void;

    let allOptions = Object.keys(options);

    function handleOptionsChange(key: string, value: string) {
        options = { ...options, [key]: value };
        onOptionsChange(options);
    }
</script>

<form>
    <div class="flex flex-col space-y-2">
        {#each allOptions as key}
            <ModulationValueSelector
                {key}
                defaultOption={options[key]}
                onOptionsChange={handleOptionsChange}
            />
        {/each}
    </div>
</form>
