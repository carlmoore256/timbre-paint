<script lang="ts">
    import { modulationKeysStore } from "../lib/audio/ModulationDataRouter";
    export let key: string;
    export let defaultOption: string;
    export let onOptionsChange: (key: string, options: any) => void;

    function handleChange(event: Event) {
        const select = event.target as HTMLSelectElement;
        onOptionsChange(key, select.value);
    }
</script>

<label for="modulationValueSelector">{key}</label>
<select
    id="modulationValueSelector"
    name="modulationValueSelector"
    value={defaultOption}
    on:change={handleChange}
>
    {#each $modulationKeysStore as key}
        <option value={key}>{key}</option>
    {/each}
</select>
