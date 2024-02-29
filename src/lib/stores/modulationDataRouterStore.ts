import { writable } from "svelte/store";
import { ModulationDataRouter } from "../audio/ModulationDataRouter";
export const modulationDataRouterStore = writable<ModulationDataRouter>(new ModulationDataRouter());