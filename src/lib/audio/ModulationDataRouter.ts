// make a global router that can update reactive variables
import { ModulationDataSource } from "./ModulationDataSource";
import type { ModulationDataValueRecord } from "./ModulationDataSource";
import { writable } from "svelte/store";

export const modulationKeysStore = writable<string[]>([]);

export class ModulationDataRouter {
    private sources: Record<string, ModulationDataSource> = {};
    private keySourceRecord: Record<string, ModulationDataSource> = {};

    public getKeys(): string[] {
        return Object.keys(this.keySourceRecord);
    }

    public addSource(
        id: string,
        source: ModulationDataSource,
        useAsCallback = false
    ) {
        if (this.sources[id]) {
            console.log(`ModulationDataRouter: removing source ${id}`);
            this.removeSource(id);
        }
        this.sources[id] = source;
        for (const key of source.getKeys()) {
            this.keySourceRecord[key] = source;
        }

        modulationKeysStore.set(this.getKeys());
    }

    public removeSource(id: string) {
        if (!this.sources[id]) {
            console.warn(
                `ModulationDataRouter: source with name ${id} does not exist`
            );
            return;
        }
        console.log(`ModulationDataRouter: removing source ${id}`);
        for (const key of this.getKeys()) {
            if (this.keySourceRecord[key] === this.sources[id]) {
                delete this.keySourceRecord[key];
            }
        }
        this.sources[id].destroy();
        delete this.sources[id];

        modulationKeysStore.set(this.getKeys());
    }

    public getValue(key: string): number | null {
        // search for the key in cached sources
        if (this.keySourceRecord[key]) {
            return this.keySourceRecord[key].getValue(key);
        }
        // if not found, search in all sources
        for (const source of Object.values(this.sources)) {
            const value = source.getValue(key);
            if (value !== null) {
                this.keySourceRecord[key] = source;
                return value;
            }
        }
        return null;
    }
}

export const modulationDataRouterStore = writable<ModulationDataRouter>(
    new ModulationDataRouter()
);
