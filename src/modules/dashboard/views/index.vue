<template>
  <el-container style="height:100%;">
    <el-header class="fit">
      <header-bar v-model:editing="editing" v-model:breakpoint="configBreakpoint"/>
    </el-header>
    <el-main style="padding: 0;">
      <el-container style="height:100%">
        <el-aside style="padding:0;width:fit-content;border-right: var(--psr-border);" v-show="editing">
          <widget-list
              :widgets="widgets"
              @add-widget="addWidget"
          />
        </el-aside>
        <el-main style="padding:0;" :class="editing?'editing':''">
          <view-port
              :style="{
                width:editing? configViewPortWidth+'px':'unset',
              }"
              :editing="editing"
              :template-config="templateConfig"
          />
        </el-main>
      </el-container>
    </el-main>
  </el-container>
</template>

<script lang="ts">
import {computed, defineComponent, ref} from "vue";
import HeaderBar from "./components/header-bar.vue";
import WidgetList from "@/modules/dashboard/views/components/widget-list.vue";
import ViewPort from "@/modules/dashboard/views/components/view-port.vue";
import {PsrDashboardWidget} from "../types/PsrDashboardWidget";
import {BlankTemplateConfig, BreakpointKey, breakpointKeys, breakpointWidth, TemplateConfig, TemplateConfigRaw} from "@/modules/dashboard/types/TemplateConfig";
import {useDashboardWidgetManager} from "@/modules/dashboard/plugins/PsrDashboardWidgetManagerProvider";


export default defineComponent({
  name: "dashboard",
  components: {
    ViewPort,
    WidgetList,
    HeaderBar,
  },
  setup() {
    const widgetManager = useDashboardWidgetManager()
    const configBreakpoint = ref<BreakpointKey>('lg')
    const configViewPortWidth = computed(() => {
      return breakpointWidth[configBreakpoint.value] + 180
    })
    const templateConfigRaw: TemplateConfigRaw = {
      lg: [
        {x: 0, y: 0, w: 1, h: 2, widget: {name: ''}},
        {x: 1, y: 0, w: 1, h: 4, widget: {name: ''}},
        {x: 2, y: 0, w: 1, h: 5, widget: {name: ''}},
        {x: 3, y: 0, w: 1, h: 3, widget: {name: ''}},
        {x: 4, y: 0, w: 1, h: 3, widget: {name: ''}}
      ]
    }
    const templateConfig = ref<TemplateConfig>(BlankTemplateConfig)
    for (const breakpointKey of breakpointKeys) {
      const _templateConfigRaw = templateConfigRaw[breakpointKey]
      if (_templateConfigRaw != undefined) {
        for (let i = 0; i < _templateConfigRaw.length; i++) {
          const templateConfigRawElement = _templateConfigRaw[i];
          templateConfig.value[breakpointKey].push({
            ...templateConfigRawElement,
            widget: widgetManager.widgetByName[templateConfigRawElement.widgetName],
            i: i + 1 + ''
          })
        }
      }
    }


    function addWidget(widget: PsrDashboardWidget) {
      let y = 0
      let i = 1
      for (const templateConfigItem of templateConfig.value[configBreakpoint.value]) {
        if (templateConfigItem.x == 0 && templateConfigItem.y + templateConfigItem.h > y) {
          y = templateConfigItem.y + templateConfigItem.h
        }
        const itemI = parseInt(templateConfigItem.i)
        if (itemI >= i) {
          i = itemI + 1
        }
      }
      templateConfig.value[configBreakpoint.value].push({
        i: i + '',
        x: 0,
        y,
        w: 1,
        h: 1,
        widget
      });
    }

    return {
      configBreakpoint,
      configViewPortWidth,
      addWidget,
      editing: ref(false),
      templateConfig,
      widgets: widgetManager.widgetCatalogs
    }
  }
})
</script>

<style lang="scss" scoped>
.editing {
  background-image: linear-gradient(90deg, rgba(0, 0, 0, 0.3) 10%, rgba(0, 0, 0, 0) 10%),
  linear-gradient(rgba(0, 0, 0, 0.3) 10%, rgba(0, 0, 0, 0) 10%);
  background-size: 10px 10px;
}
</style>