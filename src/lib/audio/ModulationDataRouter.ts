// make a global router that can update reactive variables
import { ModulationDataSource } from "./ModulationDataSource";
import type { ModulationDataValueRecord } from "./ModulationDataSource";

export class ModulationDataRouter {
    private sources: ModulationDataSource[] = [];

    public addSource(source: ModulationDataSource) {
        this.sources.push(source);
        source.onUpdate = (data) => this.handleSourceUpdate(data);
    }

    public removeSource(source: ModulationDataSource) {
        const index = this.sources.indexOf(source);
        if (index !== -1) {
            this.sources.splice(index, 1);
        }
    }

    public queryData(key: string): number[] | number[][] | number | null {
        for (const source of this.sources) {
            if (source.getKeys().includes(key)) {
                return source.getValue()[key];
            }
        }
        return null;
    }

    private handleSourceUpdate(data: ModulationDataValueRecord) {
        // Handle or dispatch updated data
    }
}
