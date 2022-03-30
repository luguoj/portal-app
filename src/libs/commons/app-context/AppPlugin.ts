import {App} from "vue";
import {AppContext} from "./AppContext";

export class AppPlugin {
    injectKey: string
    appContext?: AppContext

    constructor(injectKey: string) {
        this.injectKey = injectKey
    }

    install(app: App, appContext: AppContext) {
        this.appContext = appContext
        app.provide(this.injectKey, this)
    }
}