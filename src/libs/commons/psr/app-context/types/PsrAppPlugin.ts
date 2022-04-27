import {App} from "vue";
import {PsrAppContext} from "../PsrAppContext";

export abstract class PsrAppPlugin {
    injectKey: string
    private _appContext?: PsrAppContext

    constructor(injectKey: string) {
        this.injectKey = injectKey
    }

    install(app: App, appContext: PsrAppContext) {
        this._appContext = appContext
        app.provide(this.injectKey, this)
    }

    appContext() {
        if (this._appContext) {
            return this._appContext
        } else {
            throw new Error("应用插件未安装到上下文上")
        }
    }
}