import {App} from "vue";
import {PsrAppContext} from "../PsrAppContext";

export abstract class PsrAppPlugin {
    injectKey: string
    appContext?: PsrAppContext

    constructor(injectKey: string) {
        this.injectKey = injectKey
    }

    install(app: App, appContext: PsrAppContext) {
        this.appContext = appContext
        app.provide(this.injectKey, this)
    }

    abstract onLayoutChange(): void
}