// import 'element-plus/es/components/message-box/style'
// import 'element-plus/es/components/message/style'
import {ElIcon} from "element-plus";
import {App} from "@vue/runtime-core";

export function useElementPlus(app: App): void {
    app.component('ElIcon', ElIcon)
}