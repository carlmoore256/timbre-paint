export type ModulationDataValueRecord = Record<string, number>;

export abstract class ModulationDataSource {
    abstract getKeys(): string[];
    abstract getValue(key: string): number | null;
}
