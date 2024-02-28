<script lang="ts">
    import p5 from "p5";
    import { onMount } from "svelte";
    import type { TimbreCanvasModulationSource } from "../lib/types";

    export let options: TimbreCanvasModulationSource = {
        xPos: "MFCC0",
        yPos: "MFCC1",
        hue: "MFCC2",
        opacity: "loudness",
        scale: "rms",
        globalScale: "none",
    };

    export let width: number = window.innerWidth;
    export let height: number = window.innerHeight;
    export let backgroundColor: string | any = "#222222";
    export let backgroundTransparency: number = 0.2;

    let _p5: p5;

    let canvasContainer: HTMLElement;
    let nodes = [];

    onMount(() => {
        new p5(sketch, canvasContainer);
    });

    const sketch = (p: p5) => {
        _p5 = p;
        p.setup = () => setup(p);
        p.draw = () => draw(p);
    };

    function setup(p: p5) {
        p.createCanvas(width, height);
        p.background(backgroundColor);
        p.colorMode(p.HSB, 1);
    }

    function draw(p: p5) {
        p.background(0, 0, 0.1, backgroundTransparency);
        // p.circle(p.random(0, width), p.random(0, height), 20);
    }

    // there needs to be a function that gets the features from a global router

    $: {
        if (_p5) {
            _p5.resizeCanvas(width, height);
            // _p5.background(backgroundColor);
        }
    }
</script>

<div bind:this={canvasContainer}></div>
