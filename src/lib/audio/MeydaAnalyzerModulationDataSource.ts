import { ModulationDataSource } from "./ModulationDataSource";
import type { MeydaAudioFeature, MeydaFeaturesObject } from "meyda";
import { MeydaAnalyzer } from "meyda/dist/esm/meyda-wa";
import type { MfccCoefficientType, AudioFeatureType } from "../types";
import { writable } from "svelte/store";

export type MeydaAnalyzerKey = AudioFeatureType | MfccCoefficientType;

export const meydaAnalyzerDataSourceStore = writable<MeydaAnalyzerModulationDataSource | null>(null);


export class MeydaAnalyzerModulationDataSource extends ModulationDataSource {
    private _analyzer: MeydaAnalyzer;
    private _featureExtractorKeys: MeydaAudioFeature[] = [];
    private _currentFeatures: Partial<MeydaFeaturesObject> = {};
    private _featureRanges: Partial<
        Record<MeydaAnalyzerKey, [number, number]>
    > = {};
    private _allKeys: string[] = [];
    private _analyzerListeners: ((
        features: Partial<MeydaFeaturesObject>
    ) => void)[] = [];

    private _id = Math.random().toString(36).substr(2, 9);

    constructor(analyzer: MeydaAnalyzer) {
        super();
        this._analyzer = analyzer;
        this._featureExtractorKeys = Object.keys(
            this._analyzer._m.featureExtractors
        ) as MeydaAudioFeature[];
        this._analyzer._m.callback = (features: Partial<MeydaFeaturesObject>) =>
            this.analyzerCallback(features);
        meydaAnalyzerDataSourceStore.set(this);
    }

    public addListener(
        listener: (features: Partial<MeydaFeaturesObject>) => void
    ) {
        this._analyzerListeners.push(listener);
    }

    public removeListener(
        listener: (features: Partial<MeydaFeaturesObject>) => void
    ) {
        const index = this._analyzerListeners.indexOf(listener);
        if (index > -1) {
            this._analyzerListeners.splice(index, 1);
        }
    }

    // not resource intensive
    public getKeys() {
        if (this._allKeys.length == 0) {
            const mfccKeys = this.getMfccKeys();
            const allKeys = [
                ...mfccKeys,
                ...this._featureExtractorKeys,
            ] as string[];
            // remove "mfcc" from the list of keys
            const index = allKeys.indexOf("mfcc");
            if (index > -1) {
                allKeys.splice(index, 1);
            }
            this._allKeys = allKeys;
        }
        return this._allKeys;
    }

    private getMfccKeys() {
        const mfccKeys: MfccCoefficientType[] = [];
        for (let i = 0; i < 12; i++) {
            mfccKeys.push(`MFCC${i}` as MfccCoefficientType);
        }
        return mfccKeys;
    }

    private normalizeFeatureValue(key: MeydaAnalyzerKey, value: number) {
        const range = this._featureRanges[key];
        if (!range) {
            console.warn(
                `MeydaAnalyzerModulationDataSource: no range for key ${key}`
            );
            return null;
        }
        const [min, max] = range;
        this._featureRanges[key] = [Math.min(min, value), Math.max(max, value)];
        return (value - min) / (max - min);
    }

    private analyzerCallback = (features: Partial<MeydaFeaturesObject>) => {
        this._currentFeatures = features;
        for (let listener of this._analyzerListeners) {
            listener(features);
        }
        // console.log(`ID: ${this._id} receiving features`);
    };

    public getValue(key: MeydaAnalyzerKey) {
        if (key.startsWith("MFCC")) {
            const mfccIndex = parseInt(key.slice(4), 10);
            return this.getMFCCValue(mfccIndex);
        }

        if (!Object.keys(this._currentFeatures).includes(key)) {
            return null;
        }

        // add more special cases here
        if (key === "loudness") {
            return this._currentFeatures.loudness!.total;
        }

        const value = this._currentFeatures[key as keyof MeydaFeaturesObject];
        if (value === undefined) {
            return null;
        } else if (typeof value === "object") {
            console.error("ModulationDataSource: value is not a number", value);
            return null;
        }

        return value;
    }

    private getMFCCValue(mfccIndex: number) {
        if (!this._currentFeatures.mfcc) {
            return null;
        }
        if (mfccIndex < 0 || mfccIndex >= this._currentFeatures.mfcc.length) {
            return null;
        }

        let value = this._currentFeatures.mfcc[mfccIndex];
        const index = `MFCC${mfccIndex}` as MfccCoefficientType;

        this._featureRanges[index] = [
            Math.min(value, this._featureRanges[index]?.[0] ?? value),
            Math.max(value, this._featureRanges[index]?.[1] ?? value),
        ];

        const range = this._featureRanges[index];
        if (!range) {
            console.warn(
                `MeydaAnalyzerModulationDataSource: no range for key ${index}`
            );
            return value;
        }

        value = (value - range[0]) / (range[1] - range[0]);
        return value;
        // return this._currentFeatures.mfcc[mfccIndex];
    }

    public resetNormalization() {
        this._featureRanges = {};
    }

    public destroy() {
        console.log(`Calling destroy on MeydaAnalyzerModulationDataSource`);
        this._analyzer.stop();
        this._analyzer._m.callback = null;
        this._analyzer = null as any;
    }
}
