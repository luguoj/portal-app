<template>
  <el-container style="height: 100%;" v-loading="loading||saving">
    <el-header class="fit">
      <design-header-bar
          :template-type="dashboardTemplateEntity.type"
          :template-code="dashboardTemplateEntity.code"
          :dirty="dirtyData.flag"
          @refresh="handleRefresh"
          @save="handleSave"
          @run-test="handleRunTest"
          @export="handleExport"
          @import="handleImport"
      >
        <header-bar-tools-masonry v-model:breakpoint="designBreakpoint"/>
      </design-header-bar>
    </el-header>
    <el-main style="padding: 0;">
      <el-container style="height: 100%;">
        <el-aside style="width:fit-content;border-right:var(--psr-border);">
          <widget-list @add-widget="addWidget"/>
        </el-aside>
        <el-main style="padding: 0">
          <div class="design-board">
            <psr-masonry-dashboard
                :style="{
              width:!testing? designViewPortWidth+'px':'unset'
            }"
                ref="dashboardRef"
                :designing="!testing"
                :responsive="testing"
                :layout-options="templateContent"
            />
          </div>
          <div style="height:300px"/>
        </el-main>
      </el-container>
    </el-main>
  </el-container>
</template>

<script lang="ts">
import {computed, defineComponent, onMounted, reactive, ref} from "vue";
import DesignHeaderBar from "../../components/design-header-bar.vue";
import {DashboardTemplateEntity} from "@/services/portal/types";
import HeaderBarToolsMasonry from "@/modules/admin-console/views/portal/dashboard/design/masonry/components/header-bar-tools-masonry.vue";
import {BlankLayoutOptions, BREAKPOINT_KEYS, BreakpointKey, colNumByBreakpoint, ItemOptions, LayoutOptions, widthByBreakpoint} from "@/libs/components/psr/widgets/dashboard/masonry/types/LayoutOptions";
import {useFullscreen} from "@vueuse/core";
import PsrMasonryDashboard from "@/libs/components/psr/widgets/dashboard/masonry/index.vue";
import {portalService} from "@/services/portal";
import WidgetList from "@/modules/admin-console/views/portal/dashboard/components/widget-list.vue";
import {PsrAppWidget, PsrAppWidgetManager} from "@/libs/commons/psr/app-context/widget-manager";
import {PsrMasonryDashboardTemplateItemRaw, PsrMasonryDashboardTemplateRaw} from "@/modules/admin-console/views/portal/dashboard/design/masonry/types/PsrMasonryDashboardTemplateRaw";
import {useAppContext} from "@/libs/commons/psr/app-context";
import FileSaver from "file-saver";
import moment from "moment";

function extractTemplate(content: string | undefined, widgetManager: PsrAppWidgetManager): LayoutOptions {
  const template = BlankLayoutOptions()
  if (content) {
    const templateRaw: PsrMasonryDashboardTemplateRaw = JSON.parse(content)
    for (const breakpointKey of BREAKPOINT_KEYS) {
      const _templateRaw = templateRaw[breakpointKey]
      for (let i = 0; i < _templateRaw.length; i++) {
        const {x, y, w, h, widgetName} = _templateRaw[i];
        const {name, title, component} = widgetManager.widgetByName.value[widgetName]
        const itemOptions: ItemOptions = {
          x, y, w, h,
          name, title, component,
          i: i + 1 + ''
        }
        template[breakpointKey].push(itemOptions)
      }
    }
  }
  return template
}

function buildTemplateContent(template: LayoutOptions): string {
  const templateRaw: PsrMasonryDashboardTemplateRaw = {lg: [], md: [], sm: [], xs: [], xxs: []}
  for (const breakpointKey of BREAKPOINT_KEYS) {
    const _template = template[breakpointKey]
    for (let i = 0; i < _template.length; i++) {
      const {x, y, h, w, name} = _template[i];
      const templateConfigRawElement: PsrMasonryDashboardTemplateItemRaw = {
        x, y, h, w,
        widgetName: name
      }
      templateRaw[breakpointKey].push(templateConfigRawElement)
    }
  }
  return JSON.stringify(templateRaw)
}

export default defineComponent({
  name: "admin-console-portal-dashboard-design-masonry",
  components: {
    WidgetList,
    HeaderBarToolsMasonry,
    DesignHeaderBar,
    PsrMasonryDashboard
  },
  props: {
    dashboardTemplateId: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const widgetManager = useAppContext().widget
    const dashboardRef = ref()
    const loading = ref(false)
    const saving = ref(false)
    const dashboardTemplateEntity = ref<DashboardTemplateEntity>({})
    const dirtyData = computed(() => {
      return {flag: true}
    })
    const designBreakpoint = ref<BreakpointKey>('lg')
    const designViewPortWidth = computed(() => {
      return widthByBreakpoint[designBreakpoint.value] + 180
    })
    const templateContent = ref<LayoutOptions>(BlankLayoutOptions())

    function handleRefresh() {
      loading.value = true
      portalService.crud.dashboardTemplate.findAllById([props.dashboardTemplateId]).then(data => {
        if (data && data.length > 0) {
          dashboardTemplateEntity.value = data[0]
          templateContent.value = extractTemplate(dashboardTemplateEntity.value.content, widgetManager)
        }
      }).finally(() => {
        loading.value = false
      })
    }

    function handleSave() {
      saving.value = true
      portalService.crud.dashboardTemplate.patch(['content'], {
        id: dashboardTemplateEntity.value.id,
        version: dashboardTemplateEntity.value.version,
        content: buildTemplateContent(templateContent.value)
      }).then(entity => {
        dashboardTemplateEntity.value = entity
      }).finally(() => {
        saving.value = false
      })
    }

    const {toggle: toggleFullscreen, isFullscreen: testing} = useFullscreen(dashboardRef)

    function handleRunTest() {
      toggleFullscreen()
    }

    function addWidget(widget: PsrAppWidget) {
      let y = 0
      let i = 1
      for (const templateConfigItem of templateContent.value[designBreakpoint.value]) {
        if (templateConfigItem.x == 0 && templateConfigItem.y + templateConfigItem.h > y) {
          y = templateConfigItem.y + templateConfigItem.h
        }
        const itemI = parseInt(templateConfigItem.i)
        if (itemI >= i) {
          i = itemI + 1
        }
      }
      const itemOptions: ItemOptions = reactive({
        i: i + '',
        x: 0,
        y,
        w: 1,
        h: 1,
        ...widget
      })
      templateContent.value[designBreakpoint.value].push(itemOptions);
    }

    const xAxisWidth = computed(() => {
      return (designViewPortWidth.value - 10) / colNumByBreakpoint[designBreakpoint.value] + 'px'
    })

    function handleExport() {
      const fileContent = new Blob([buildTemplateContent(templateContent.value)], {type: 'text/plain;charset=utf-8'})
      const timestamp = moment().format('YYYYMMDD-HHmmss')
      FileSaver.saveAs(fileContent, `${dashboardTemplateEntity.value.code}-${timestamp}.masonry.design`)
    }

    function handleImport(templateFileContent?: string) {
      templateContent.value = extractTemplate(templateFileContent, widgetManager)
    }

    onMounted(() => {
      handleRefresh()
    })
    return {
      dashboardRef,
      testing,
      loading,
      saving,
      dashboardTemplateEntity,
      templateContent,
      dirtyData,
      handleRefresh,
      handleSave,
      handleRunTest,
      addWidget,
      handleExport,
      handleImport,
      designBreakpoint,
      designViewPortWidth,
      xAxisWidth
    }
  }
})
</script>

<style lang="scss" scoped>
.design-board {
  --x-axis-width: v-bind(xAxisWidth);
  background-image: linear-gradient(90deg, rgba(0, 0, 0, 0.0) 4px, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.0) 5px);
  background-size: v-bind(xAxisWidth) 100%;
  width: fit-content;
  margin: 15px;
  box-shadow: 0 0 10px 0 rgb(0 0 0 / 50%);
}

</style>