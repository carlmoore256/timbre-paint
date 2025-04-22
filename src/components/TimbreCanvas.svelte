<script lang="ts">
    import p5 from "p5";
    import { onMount, onDestroy } from "svelte";
    import type {
        ModulationAxisOptions,
        TimbreCanvasGlobalOptions,
    } from "../lib/types";
    import { modulationDataRouterStore } from "../lib/stores/modulationDataRouterStore";
    import { CircleNode } from "../lib/visual/CircleNode";
    import { meydaAnalyzerDataSourceStore } from "../lib/audio/MeydaAnalyzerModulationDataSource";

    export let axisOptions: ModulationAxisOptions;
    export let globalOptions: TimbreCanvasGlobalOptions;
    export let width: number = window.innerWidth;
    export let height: number = window.innerHeight;
    export let isPlaying: boolean = false;

    let _p5: p5;
    let canvasContainer: HTMLElement;
    let circleNodes: CircleNode[] = [];

    onMount(() => {
        initializeSketch();
    });

    onDestroy(() => {
        if (_p5) {
            _p5.remove();
        }
    });

    $: axisOptions, initializeSketch();
    
    $: center = new p5.Vector(width / 2, height / 2);

    $: if ($meydaAnalyzerDataSourceStore) {
        $meydaAnalyzerDataSourceStore.addListener((features) => {
            spawnNode();
        });
    }

    function spawnNode() {
        if (!_p5) {
            return;
        }
        const threshVal = $modulationDataRouterStore.getValue(globalOptions.spawnThreshold.source) || 1;
        if (threshVal > globalOptions.spawnThreshold.threshold) {
            const newNode = createNode(_p5);
            newNode.addOnDeathListener((circleNode: CircleNode) => {
                const index = circleNodes.indexOf(circleNode);
                // remove the node on death
                circleNodes.splice(index, 1);
            });
            circleNodes.push(newNode);
        }
    }

    
    function initializeSketch() {
        new p5(sketch, canvasContainer);
    }

    const sketch = (p: p5) => {
        if (_p5) {
            _p5.remove();
        }
        _p5 = p;
        p.setup = () => setup(p);
        p.draw = () => draw(p);
    };

    function setup(p: p5) {
        p.createCanvas(width, height);
        p.background(globalOptions.backgroundColor);
        p.colorMode(p.HSB, 1);
    }


    function draw(p: p5) {
        if (!isPlaying) {
            return;
        }
        p.background(0, 0.1, 0.1, globalOptions.backgroundTransparency);
        p.noStroke();

        const lerpIntensity = $modulationDataRouterStore.getValue("rms") || 1;

        const newCenter = p.createVector(0, 0);

        for (let i = 0; i < circleNodes.length; i++) {
            const node = circleNodes[i];
            // node.draw(p);
            // const lerp = node.age * lerpIntensity;
            const lerp = lerpIntensity;
            newCenter.add(node.position);

            if (globalOptions.gravitate.active) {
                let grav: p5.Vector = p.createVector(0, 0);

                if (globalOptions.gravitate.type === "center") {
                    grav = center;
                } else if (globalOptions.gravitate.type === "mouse") {
                    const mouseX = p.mouseX;
                    const mouseY = p.mouseY;
                    grav = p.createVector(
                        mouseX - node.position.x,
                        mouseY - node.position.y
                    );
                } else if (globalOptions.gravitate.type === "rope") {
                    if (i > 0) {
                        const lastNode = circleNodes[i - 1];
                        grav = lastNode.position;
                    }
                }

                node.lerpToPosition(grav, lerp);
            }

            if (i > 0) {
                const lastNode = circleNodes[i - 1];
                p.strokeWeight(6);
                p.stroke(node.color);
                p.line(
                    node.position.x,
                    node.position.y,
                    lastNode.position.x,
                    lastNode.position.y
                );
            }

            node.advanceAge(globalOptions.ageRate);
            node.lerpToVelocity(lerpIntensity);
        }

        // make center the avg of new center and center
        center = p5.Vector.lerp(
            center,
            newCenter.div(circleNodes.length),
            0.9
        );

        while (circleNodes.length > globalOptions.maxNodes) {
            circleNodes.shift();
        }
    }

    function createNode(p: p5) {
        let xPos = $modulationDataRouterStore.getValue(axisOptions.xPos) || 0;
        let yPos = $modulationDataRouterStore.getValue(axisOptions.yPos) || 0;
        const hue = $modulationDataRouterStore.getValue(axisOptions.hue) || 0;
        const opacity =
            $modulationDataRouterStore.getValue(axisOptions.opacity) || 1;
        const scale =
            $modulationDataRouterStore.getValue(axisOptions.scale) || 1;
        // const velX = Math.random() * 2 - 1;
        // const velY = Math.random() * 2 - 1;
        const velX = 0;
        const velY = 0;

        // const velX = $modulationDataRouterStore.getValue(axisOptions.velocityX) || 0;
        // const velY = $modulationDataRouterStore.getValue(axisOptions.velocityY) || 0;

        let centerX = width / 2;
        let centerY = height / 2;

        // xPos = p.map(xPos, 0, 1, -1, 1);
        // yPos = p.map(yPos, 0, 1, -1, 1);
        // const pos = p.createVector(
        //     xPos * globalOptions.scale * width + centerX,
        //     yPos * globalOptions.scale * height + centerY
        // );

        const pos = p.createVector(xPos * width, yPos * height);

        // create a new node
        return new CircleNode(
            pos,
            p.color(hue, 1, 1, opacity),
            scale * 500,
            1.0,
            p.createVector(velX, velY).mult(10)
        );
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
