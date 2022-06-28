<template>
  <psr-filter-paging-data-table :model="model">
    <p-column field="enabled" header="状态" :showFilterMenu="false"
              style="width:5rem;min-width:5rem;max-width:5rem;">
      <template #body="slotProps">
        <el-icon class="pi" :class="slotProps.data[slotProps.field]?'pi-check':'pi-ban'" style="width:100%;"/>
      </template>
      <template #filter="{filterModel,filterCallback}">
        <p-tri-state-checkbox v-model="filterModel.value" @change="filterCallback()"/>
      </template>
    </p-column>
    <p-column
        field="code"
        header="编码"
        :style="{width:'360px'}"
        :sortable="true"
    >
      <template #body="slotProps">
        <div class="psr-text-nowrap">{{ slotProps.data[slotProps.field] }}</div>
      </template>
      <template #filter="{filterModel,filterCallback}">
        <el-input v-model="filterModel.value" @change="filterCallback()"/>
      </template>
    </p-column>
    <p-column
        field="description"
        header="描述"
        :style="{width:'360px'}"
        :sortable="true"
    >
      <template #body="slotProps">
        <div class="psr-text-nowrap">{{ slotProps.data[slotProps.field] }}</div>
      </template>
      <template #filter="{filterModel,filterCallback}">
        <el-input v-model="filterModel.value" @change="filterCallback()"/>
      </template>
    </p-column>
    <p-column
        header="操作"
        frozen
        alignFrozen="right"
        :style="{width:'153px','min-width':'153px','max-width':'153px'}"
    >
      <template #body="{data}">
        <el-space wrap>
          <el-button
              v-if="canEdit"
              link
              size="small"
              @click="$emit('edit',data)"
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
          <el-dropdown trigger="click">
            <el-button
                link
                size="small"
            >
              更多
              <el-icon class="el-icon--right pi pi-angle-down"/>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <router-link
                    v-if="canRoutePermission"
                    :to="{name:permissionRoute,params:{groupId:data.id}}"
                >
                  <el-dropdown-item>许可</el-dropdown-item>
                </router-link>
                <router-link
                    v-if="canRouteUser"
                    :to="{name:userRoute,params:{groupId:data.id}}"
                >
                  <el-dropdown-item>用户</el-dropdown-item>
                </router-link>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </el-space>
      </template>
    </p-column>
  </psr-filter-paging-data-table>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import PsrFilterPagingDataTable from "@/libs/components/psr/widgets/data-table/filter-paging/index.vue";
import PColumn from "primevue/column";
import PTriStateCheckbox from "primevue/tristatecheckbox";
import {PsrCreateUpdateFormDialogModel} from "@/libs/components/psr/dialogs/create-update-form/PsrCreateUpdateFormDialogModel";
import {useAppContext} from "@/libs/commons/psr/app-context";
import {ROUTE_PORTAL_GROUP_LIST, ROUTE_PORTAL_GROUP_PERMISSION, ROUTE_PORTAL_GROUP_USER} from "@/modules/admin-console/route";
import {ElMessage, ElMessageBox} from "element-plus/es";
import PsrAsyncActionButton from "@/libs/components/psr/widgets/button/async-action/index.vue";
import PsrAsyncActionDropdownItem from "@/libs/components/psr/widgets/dropdown-item/async-action/index.vue";
import {GroupEntity} from "@/services/portal/types";
import {portalService} from "@/services/portal";
import {usePermissionFlag} from "@/libs/commons/psr/app-context/usePermissionFlag";

export default defineComponent({
  name: "data-table",
  components: {
    PsrFilterPagingDataTable,
    PColumn,
    PTriStateCheckbox,
    PsrAsyncActionButton,
    PsrAsyncActionDropdownItem
  },
  emits: ['edit', 'dataChanged'],
  props: {
    model: {
      type: Object as PropType<PsrCreateUpdateFormDialogModel<GroupEntity>>
    }
  },
  setup(props, context) {
    const appContext = useAppContext()
    const router = appContext.router

    const permissionRoute = router.computeModuleRouteName(ROUTE_PORTAL_GROUP_PERMISSION.name)
    const userRoute = router.computeModuleRouteName(ROUTE_PORTAL_GROUP_USER.name)
    const canRoutePermission = usePermissionFlag('route', ROUTE_PORTAL_GROUP_PERMISSION.name)
    const canRouteUser = usePermissionFlag('route', ROUTE_PORTAL_GROUP_USER.name)
    const canDelete = usePermissionFlag('route', ROUTE_PORTAL_GROUP_LIST.name, ['delete'])
    const canEdit = usePermissionFlag('route', ROUTE_PORTAL_GROUP_LIST.name, ['edit'])

    return {

      handleDelete: (row: GroupEntity) => {
        return ElMessageBox.confirm(
            `是否删除: ${row.code}`,
            '确认删除'
        ).then(() => {
          return portalService.group.delete(row.id!).then(() => {
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
      permissionRoute,
      userRoute,
      canEdit,
      canDelete,
      canRoutePermission,
      canRouteUser
    }
  }
})
</script>

<style scoped>

</style>