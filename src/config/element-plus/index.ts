import 'element-plus/es/components/message-box/style/index'
import 'element-plus/es/components/message/style/index'
import {App} from "@vue/runtime-core";
import './custom.scss'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

export function applyElementPlus(app: App): void {
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
        app.component(key, component)
    }
}