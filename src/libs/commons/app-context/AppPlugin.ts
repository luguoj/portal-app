import {App} from "vue";
import {AppContext} from "./AppContext";

export interface AppPlugin {
    injectKey: string
    install: (app: App, appContext: AppContext) => void
}