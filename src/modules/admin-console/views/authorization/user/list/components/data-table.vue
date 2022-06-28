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
        field="id"
        header="用户名"
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
                    v-if="canRouteAuthority"
                    :to="{name:authorityRoute,params:{userId:data.id}}"
                >
                  <el-dropdown-item>权限</el-dropdown-item>
                </router-link>
                <router-link
                    v-if="canRouteGroup"
                    :to="{name:groupRoute,params:{userId:data.id}}"
                >
                  <el-dropdown-item>分组</el-dropdown-item>
                </router-link>
                <psr-async-action-dropdown-item
                    divided
                    v-if="canResetPassword"
                    :action="handleResetPassword"
                    :action-params="data"
                >
                  <template #icon>
                    <el-icon class="pi pi-key"/>
                  </template>
                  重置密码
                </psr-async-action-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </el-space>
      </template>
    </p-column>
  </psr-filter-paging-data-table>
</template>

<script lang="ts">
import {defineComponent, PropType, ref} from "vue";
import PsrFilterPagingDataTable from "@/libs/components/psr/widgets/data-table/filter-paging/index.vue";
import PColumn from "primevue/column";
import PTriStateCheckbox from "primevue/tristatecheckbox";
import {PsrCreateUpdateFormDialogModel} from "@/libs/components/psr/dialogs/create-update-form/PsrCreateUpdateFormDialogModel";
import {useAppContext} from "@/libs/commons/psr/app-context";
import {ROUTE_AUTHORIZATION_USER_AUTHORITY, ROUTE_AUTHORIZATION_USER_GROUP, ROUTE_AUTHORIZATION_USER_LIST} from "@/modules/admin-console/route";
import {ElMessage, ElMessageBox} from "element-plus/es";
import {authorizationService} from "@/services/authorization";
import {useClipboard} from "@vueuse/core";
import PsrAsyncActionButton from "@/libs/components/psr/widgets/button/async-action/index.vue";
import PsrAsyncActionDropdownItem from "@/libs/components/psr/widgets/dropdown-item/async-action/index.vue";
import {GroupEntity} from "@/services/portal/types";
import {UserEntity} from "@/services/authorization/types";
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
      type: Object as PropType<PsrCreateUpdateFormDialogModel<UserEntity>>
    }
  },
  setup(props, context) {
    const appContext = useAppContext()
    const router = appContext.router

    const authorityRoute = router.computeModuleRouteName(ROUTE_AUTHORIZATION_USER_AUTHORITY.name)
    const groupRoute = router.computeModuleRouteName(ROUTE_AUTHORIZATION_USER_GROUP.name)
    const canRouteAuthority = usePermissionFlag('route', ROUTE_AUTHORIZATION_USER_AUTHORITY.name)
    const canRouteGroup = usePermissionFlag('route', ROUTE_AUTHORIZATION_USER_GROUP.name)
    const canEdit = usePermissionFlag('route', ROUTE_AUTHORIZATION_USER_LIST.name, ['edit'])
    const canDelete = usePermissionFlag('route', ROUTE_AUTHORIZATION_USER_LIST.name, ['delete'])
    const canResetPassword = usePermissionFlag('route', ROUTE_AUTHORIZATION_USER_LIST.name, ['resetPassword'])

    return {
      handleResetPassword: (row: UserEntity) => {
        return ElMessageBox.confirm(
            `是否重置密码${row.id}`,
            '确认重置密码'
        ).then(() => {
          return authorizationService.user.resetPassword(row.id!).then((newPassword) => {
            useClipboard({source: ref(newPassword)}).copy()
            ElMessageBox.prompt('新密码(已经复制到剪贴板):', '重置成功', {
              inputValue: newPassword,
              type: 'info',
              showCancelButton: false
            })
            context.emit('dataChanged')
          })
        }).catch(() => true)
      },
      handleDelete: (row: GroupEntity) => {
        return ElMessageBox.confirm(
            `是否删除: ${row.id}`,
            '确认删除'
        ).then(() => {
          return authorizationService.user.delete(row.id!).then(() => {
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
      authorityRoute,
      groupRoute,
      canRouteAuthority,
      canRouteGroup,
      canEdit,
      canDelete,
      canResetPassword
    }
  }
})
</script>

<style scoped>

</style>