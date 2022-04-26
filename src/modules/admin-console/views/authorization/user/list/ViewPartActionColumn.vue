<template>
  <el-space wrap>
    <el-button
        v-if="canEdit"
        type="text"
        size="small"
        @click="handleEdit(slotProps.data)"
    >编辑
    </el-button>
    <psr-el-async-action-button
        v-if="canDelete"
        type="text" size="small"
        :action="handleDelete"
        :action-params="slotProps.data"
    >删除
    </psr-el-async-action-button>
    <el-dropdown trigger="click">
      <el-button
          type="text"
          size="small"
      >
        更多
        <el-icon class="el-icon--right pi pi-angle-down"/>
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <router-link
              v-if="canRouteAuthority"
              :to="{name:rowActionRoutes.authority,params:{userId:slotProps.data.id}}"
          >
            <el-dropdown-item>权限</el-dropdown-item>
          </router-link>
          <router-link
              v-if="canRouteGroup"
              :to="{name:rowActionRoutes.group,params:{userId:slotProps.data.id}}"
          >
            <el-dropdown-item>分组</el-dropdown-item>
          </router-link>
          <psr-el-async-dropdown-item
              divided
              v-if="canResetPassword"
              :action="handleResetPassword"
              :action-params="slotProps.data"
          >
            <template #icon>
              <el-icon class="pi pi-key"/>
            </template>
            重置密码
          </psr-el-async-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </el-space>
</template>

<script lang="ts">
import {defineComponent, ref} from "vue";
import {ROUTE_AUTHORIZATION_USER_AUTHORITY, ROUTE_AUTHORIZATION_USER_GROUP, ROUTE_AUTHORIZATION_USER_LIST} from "@/modules/admin-console/route";
import {useAppContext} from "@/libs/commons/app-context";
import {GroupEntity} from "@/services/portal/CRUDService";
import {ElMessage, ElMessageBox} from "element-plus";
import {UserEntity} from "@/services/authorization/CRUDService";
import {authorizationService} from "@/services/authorization";
import PsrElAsyncActionButton from "@/libs/components/psr/element-plus/buttons/PsrElAsyncActionButton.vue";
import {useClipboard} from "@vueuse/core";
import PsrElAsyncDropdownItem from "@/libs/components/psr/element-plus/dropdown-item/PsrElAsyncDropdownItem.vue";

export default defineComponent({
  name: "ViewPartActionColumn",
  components: {
    PsrElAsyncActionButton,
    PsrElAsyncDropdownItem
  },
  props: ['slotProps'],
  emits: ['edit', 'dataChanged'],
  setup(props, context) {
    const appContext = useAppContext()
    const router = appContext.router
    const rowActionRoutes = {
      authority: router.computeModuleRouteName(ROUTE_AUTHORIZATION_USER_AUTHORITY.name),
      group: router.computeModuleRouteName(ROUTE_AUTHORIZATION_USER_GROUP.name)
    }
    const canRouteAuthority = appContext.permission.usePermissionFlag(ROUTE_AUTHORIZATION_USER_AUTHORITY.name)
    const canRouteGroup = appContext.permission.usePermissionFlag(ROUTE_AUTHORIZATION_USER_GROUP.name)
    const canEdit = appContext.permission.usePermissionFlag(ROUTE_AUTHORIZATION_USER_LIST.name, ['edit'])
    const canDelete = appContext.permission.usePermissionFlag(ROUTE_AUTHORIZATION_USER_LIST.name, ['delete'])
    const canResetPassword = appContext.permission.usePermissionFlag(ROUTE_AUTHORIZATION_USER_LIST.name, ['resetPassword'])

    return {
      handleEdit: (row: UserEntity) => {
        context.emit('edit', row)
      },
      handleResetPassword: (row: UserEntity) => {
        return ElMessageBox.confirm(
            `是否重置密码${row.id}`,
            '确认重置密码'
        ).then(() => {
          return authorizationService.user.resetPassword(row.id).then((newPassword) => {
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
            `是否删除${row.id}`,
            '确认删除'
        ).then(() => {
          return authorizationService.user.delete(row.id).then(() => {
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
      rowActionRoutes,
      canRouteAuthority,
      canRouteGroup,
      canEdit,
      canDelete,
      canResetPassword
    }
  }
})
</script>

<style lang="scss" scoped>

</style>