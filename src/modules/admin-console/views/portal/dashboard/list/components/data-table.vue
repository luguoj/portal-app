<template>
  <psr-filter-tree-table :model="model">
    <p-column
        :hidden="!canEdit&&!canDelete"
        field="enabled" header="状态"
        filterMatchMode="equals"
        style="width:5rem;min-width:5rem;max-width:5rem;"
    >
      <template #body="{node:{key,data}}">
        <el-icon v-if="data.dashboardTemplate" class="pi" :class="data.enabled?'pi-check':'pi-ban'" style="width:100%;"/>
      </template>
      <template #filter>
        <p-tri-state-checkbox v-model="model.filters.enabled"/>
      </template>
    </p-column>
    <p-column
        field="path"
        header="编码"
        :style="{width:'360px'}"
        :sortable="true"
        :expander="true"
    >
      <template #body="{node:{key,data}}">
          {{ data.path }}
      </template>
      <template #filter>
        <el-input v-model="model.filters.path"/>
      </template>
    </p-column>
    <p-column
        field="description"
        header="描述"
        :style="{width:'360px'}"
        :sortable="true"
    >
      <template #body="{node:{key,data}}">
        <div class="psr-text-nowrap">{{ data.description }}</div>
      </template>
      <template #filter>
        <el-input v-model="model.filters.description"/>
      </template>
    </p-column>
    <p-column
        field="type"
        header="类型"
        :style="{width:'360px'}"
        :sortable="true"
        filterMatchMode="equals"
    >
      <template #body="{node:{key,data}}">
        <div class="psr-text-nowrap">{{ DashboardTemplateTypes.get(data.type)?.title }}</div>
      </template>
      <template #filter>
        <dashboard-template-type-select v-model="model.filters.type" clearable/>
      </template>
    </p-column>
    <p-column
        header="操作"
        frozen
        alignFrozen="right"
        :style="{width:'153px','min-width':'153px','max-width':'153px'}"
    >
      <template #body="{node:{key,data},field}">
        <el-space v-if="data.dashboardTemplate" wrap>
          <el-button
              v-if="canEdit"
              link
              size="small"
              @click="$emit('edit',data.dashboardTemplate)"
          >编辑
          </el-button>
          <psr-async-action-button
              v-if="canDelete"
              link
              size="small"
              :action="handleDelete"
              :action-params="data"
          >删除
          </psr-async-action-button>
          <router-link
              v-if="canRouteDesign[data.type]"
              :to="{name:designRoute[data.type],params:{dashboardTemplateId:data.id}}"
              custom
              v-slot="{navigate}"
          >
            <el-button
                link
                size="small"
                @click="navigate"
            >设计
            </el-button>
          </router-link>
        </el-space>
      </template>
    </p-column>
  </psr-filter-tree-table>
</template>

<script lang="ts">
import {defineComponent, PropType, watchEffect} from "vue";
import PColumn from "primevue/column";
import PTriStateCheckbox from "primevue/tristatecheckbox";
import {useAppContext} from "@/libs/commons/psr/app-context";
import {ElMessage, ElMessageBox} from "element-plus/es";
import PsrAsyncActionButton from "@/libs/components/psr/widgets/button/async-action/index.vue";
import PsrAsyncActionDropdownItem from "@/libs/components/psr/widgets/dropdown-item/async-action/index.vue";
import {portalService} from "@/services/portal";
import {PsrFilterTreeTableModel} from "@/libs/components/psr/widgets/tree-table/filter/PsrFilterTreeTableModel";
import PsrFilterTreeTable from "@/libs/components/psr/widgets/tree-table/filter/index.vue";
import PTreeTable from "primevue/treetable";
import {usePermissionFlag} from "@/libs/commons/psr/app-context/usePermissionFlag";
import DashboardTemplateTypeSelect from "@/modules/admin-console/views/portal/dashboard/list/components/dashboard-template-type-select.vue";
import DashboardTemplateTypes from "@/services/portal/dictionary/DashboardTemplateTypes";
import {ROUTE_PORTAL_DASHBOARD_DESIGN_BIG_SCREEN, ROUTE_PORTAL_DASHBOARD_DESIGN_MASONRY, ROUTE_PORTAL_DASHBOARD_LIST} from "@/modules/admin-console/route";
import {NodeData} from "@/modules/admin-console/views/portal/dashboard/list/types";

export default defineComponent({
  name: "data-table",
  components: {
    DashboardTemplateTypeSelect,
    PsrFilterTreeTable,
    PTreeTable,
    PColumn,
    PTriStateCheckbox,
    PsrAsyncActionButton,
    PsrAsyncActionDropdownItem
  },
  emits: ['edit', 'dataChanged'],
  props: {
    model: {
      type: Object as PropType<PsrFilterTreeTableModel<NodeData>>,
      required: true
    }
  },
  setup(props, context) {
    const appContext = useAppContext()
    const router = appContext.router
    const designRoute = {
      'masonry': router.computeModuleRouteName(ROUTE_PORTAL_DASHBOARD_DESIGN_MASONRY.name),
      'big-screen': router.computeModuleRouteName(ROUTE_PORTAL_DASHBOARD_DESIGN_BIG_SCREEN.name)
    }
    const canRouteDesign = {
      'masonry': usePermissionFlag('route', ROUTE_PORTAL_DASHBOARD_DESIGN_MASONRY.name),
      'big-screen': usePermissionFlag('route', ROUTE_PORTAL_DASHBOARD_DESIGN_BIG_SCREEN.name)
    }
    const canDelete = usePermissionFlag('route', ROUTE_PORTAL_DASHBOARD_LIST.name, ['delete'])
    const canEdit = usePermissionFlag('route', ROUTE_PORTAL_DASHBOARD_LIST.name, ['edit'])
    watchEffect(() => {
      if (!canDelete.value && !canEdit.value) {
        props.model.filters.enabled = true
      } else {
        props.model.filters.enabled = null
      }
    })
    return {
      handleDelete: (row: NodeData) => {
        return ElMessageBox.confirm(
            `是否删除: ${row.dashboardTemplate?.code}`,
            '确认删除'
        ).then(() => {
          return portalService.dashboardTemplate.delete(row.id!).then(() => {
            ElMessage({
              message: '删除成功.',
              type: 'success',
            })
            context.emit('dataChanged')
          }).catch(() => {
            ElMessage({
              message: '删除失败.',
              type: 'error',
            })
          })
        }).catch(() => true)
      },
      designRoute,
      canEdit,
      canDelete,
      canRouteDesign,
      DashboardTemplateTypes
    }
  }
})
</script>

<style scoped>

</style>