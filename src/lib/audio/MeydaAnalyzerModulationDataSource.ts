import { ModulationDataSource } from "./ModulationDataSource";
import type { MeydaAudioFeature, MeydaFeaturesObject } from "meyda";
import { MeydaAnalyzer } from "meyda/dist/esm/meyda-wa";
import type { MfccCoefficientType } from "../types";

export class MeydaAnalyzerModulationDataSource extends ModulationDataSource {
    private _analyzer: MeydaAnalyzer;
    private _keys: MeydaAudioFeature[] = [];
    private _currentFeatures: Partial<MeydaFeaturesObject> = {};

    constructor(analyzer: MeydaAnalyzer) {
        super();
        this._analyzer = analyzer;
        this._keys = Object.keys(
            this._analyzer._m.featureExtractors
        ) as MeydaAudioFeature[];
        this._analyzer._m.callback = (features: Partial<MeydaFeaturesObject>) =>
            this.analyzerCallback(features);
    }

    public getKeys() {
        return this._keys as string[];
    }

    private analyzerCallback = (features: Partial<MeydaFeaturesObject>) => {
        this._currentFeatures = features;
    };

    public getValue(key: MeydaAudioFeature | MfccCoefficientType) {
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
        return this._currentFeatures.mfcc[mfccIndex];
    }
}
