<template>
  <el-dropdown size="small" @command="handleRoute">
    <el-avatar>
      <el-icon class="pi pi-user"/>
    </el-avatar>
    <template #dropdown>
      <el-dropdown-menu>
        <li class="username">{{ username }}</li>
        <el-dropdown-item
            v-for="(menuItem,index) in menuItems" :key="menuItem.id"
            :index="menuItem.id"
            :divided="index===0"
            :command="menuItem.route"
        >
          <el-icon :class="menuItem.iconCls"/>
          <div class="menu-item-title">
            {{ menuItem.title }}
          </div>
        </el-dropdown-item>
        <el-dropdown-item divided @click="handleSignOut">
          <el-icon class="pi pi-sign-out"/>
          退出系统
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script lang="ts">
import {computed, defineComponent, Ref} from "vue";
import {useAppContext} from "@/libs/commons/psr/app-context";
import {PsrAppNavigationMenuItem} from "@/libs/commons/psr/app-context/navigation-menu";
import {ElMessageBox} from "element-plus/es";
import {PsrAppRouteRecord} from "@/libs/commons/psr/app-context/route";

export default defineComponent({
  name: "avatar-dropdown",
  setup() {
    const platformClient = useAppContext().platformClient!
    const appContext = useAppContext();
    const menuItems: Ref<PsrAppNavigationMenuItem[]> = computed(() => appContext.navigationMenu.currentLayoutMenuItems.value?.userPopover || [])
    return {
      username: computed(() => appContext.personal.personal.value.fullName),
      menuItems,
      handleRoute: (route: PsrAppRouteRecord) => {
        appContext.router.router.push({path: route.path});
      },
      handleSignOut: () => {
        return ElMessageBox.confirm(
            '确认登出当前用户?',
            '登出',
            {
              type: 'warning',
            }
        ).then(() => {
          platformClient.authorizationContext.signOut()
        })
      }
    }
  }
})
</script>

<style lang="scss" scoped>
.username {
  padding: 2px 12px;
  line-height: 20px;
  font-size: 12px;
}
</style>