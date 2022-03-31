import 'element-plus/es/components/message-box/style/index'
import 'element-plus/es/components/message/style/index'
import {ElIcon} from "element-plus";
import {App} from "@vue/runtime-core";
import './element-plus/custom.scss'

export function useElementPlus(app: App): void {
    app.component('ElIcon', ElIcon)
}