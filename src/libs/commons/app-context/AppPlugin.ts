import {App} from "vue";
import {AppContext} from "./AppContext";

export interface AppPlugin {
    name: string
    install: (app: App, appContext: AppContext) => void
}