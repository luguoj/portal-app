import {App} from "vue";
import {AppContext} from "./AppContext";

export class AppPlugin {
    injectKey: string

    constructor(injectKey: string) {
        this.injectKey = injectKey
    }

    install(app: App, appContext: AppContext) {
        app.provide(this.injectKey, this)
    }
}