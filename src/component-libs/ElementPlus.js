import 'element-plus/es/components/message-box/style'
import 'element-plus/es/components/message/style'
import {ElIcon} from "element-plus";

export function useElementPlus(app) {
    app.component('ElIcon', ElIcon)
}