import { writable } from "svelte/store";

export const audioUrlStore = writable<string | null>(null);
export const isPlayingStore = writable(false);
export const audioSourceStore = writable<MediaElementAudioSourceNode | null>(null);

function createAudioContextStore() {
    const { subscribe, set } = writable<AudioContext | null>(null);

    function createFromAudioElement(audioElement: HTMLAudioElement) {
        const audioContext = new AudioContext();
        const source = audioContext.createMediaElementSource(audioElement);
        audioSourceStore.set(source);
        source.connect(audioContext.destination);
        set(audioContext);
        return audioContext;
    }

    return {
        subscribe,
        set,
        create: () => {
            const audioContext = new AudioContext();
            set(audioContext);
            return audioContext;
        },
        createFromAudioElement,
    };
}
export const audioContextStore = createAudioContextStore();
