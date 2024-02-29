export type MfccCoefficientType =
    | "MFCC0"
    | "MFCC1"
    | "MFCC2"
    | "MFCC3"
    | "MFCC4"
    | "MFCC5"
    | "MFCC6"
    | "MFCC7"
    | "MFCC8"
    | "MFCC9"
    | "MFCC10"
    | "MFCC11"
    | "MFCC12";

export type AudioFeatureType =
    | "chroma1"
    | "chroma2"
    | "chroma3"
    | "chroma4"
    | "chroma5"
    | "chroma6"
    | "chroma7"
    | "chroma8"
    | "chroma9"
    | "chroma10"
    | "chroma11"
    | "chroma12"
    | "spectralCentroid"
    | "spectralRolloff"
    | "spectralFlatness"
    | "spectralKurtosis"
    | "spectralSkewness"
    | "spectralSlope"
    | "spectralSpread"
    | "spectralCrest"
    | "spectralFlux"
    | "spectralRolloff"
    | "zcr"
    | "rms"
    | "loudness"
    | "perceptualSharpness"
    | "perceptualSpread"
    | "energy"
    | "amplitudeSpectrum"
    | "powerSpectrum"
    | "complexSpectrum"
    | "buffer"
    | "melBands"
    | "chroma"
    | "perceptualSpread"
    | "perceptualSharpness"
    | "spectralKurtosis"
    | "spectralSkewness"
    | "spectralSlope"
    | "spectralSpread"
    | "spectralCrest"
    | "spectralFlux"
    | "spectralRolloff"
    | "zcr"
    | "rms"
    | "loudness"
    | "perceptualSharpness"
    | "perceptualSpread"
    | "energy"
    | "amplitudeSpectrum"
    | "powerSpectrum"
    | "complexSpectrum"
    | "buffer"
    | "melBands"
    | "chroma"
    | "perceptualSpread"
    | "perceptualSharpness"
    | "spectralKurtosis"
    | "spectralSkewness"
    | "spectralSlope"
    | "spectralSpread"
    | "spectralCrest"
    | "spectralFlux"
    | "spectralRolloff"
    | "zcr"
    | "rms"
    | "loudness"
    | "perceptualSharpness"
    | "perceptualSpread"
    | MfccCoefficientType;

export type OscillatorDataSource = "osc1" | "osc2" | "osc3";

export type ModulationDataSource =
    | AudioFeatureType
    | OscillatorDataSource
    | "none";

// we might need a global store to route the control data

export type ModulationAxisOptions = {
    xPos: ModulationDataSource;
    yPos: ModulationDataSource;
    hue: ModulationDataSource;
    opacity: ModulationDataSource;
    scale: ModulationDataSource;
    globalScale: ModulationDataSource;
    velocityX: ModulationDataSource;
    velocityY: ModulationDataSource;
};

export type ModulationAxisOption = {
    name: string;
    key: ModulationDataSource;
    scale: number;
    power: number;
};


export type TimbreCanvasGlobalOptions = {
    backgroundColor: string;
    backgroundTransparency: number;
    maxNodes: number;
    scale: number;
    gravitate: GravitateOptions;
    ageRate: number;
    spawnThreshold: {
        source: ModulationDataSource;
        threshold: number;
    }
}

export type Ease = {
    source: ModulationDataSource | "linear";
}

export type VelocityOptions = {
    ease: Ease;
    scale: number;
    power: number;
}

export type GravitateOptions = {
    active: boolean;
    type: "mouse" | "center" | "rope";
    ease: number;
}