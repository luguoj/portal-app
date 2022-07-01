<template>
  <el-scrollbar style="height:100%;">
    <el-container>
      <el-aside style="padding:10px;">
        <el-card body-style="padding:0;">
          <template #header>
            <div class="card-header">
              <el-avatar/>
              <div style="display:inline-block;margin-left:20px;">
                <div style="font-size: var(--el-font-size-large);">Name</div>
                <div style="font-size: var(--el-font-size-extra-small);">account</div>
              </div>
            </div>
          </template>
          <el-menu
              :default-active="activeIndex"
              router
              style="border-right: unset;"
          >
            <el-menu-item :index="personnelMenu.route" :route="{name:personnelMenu.route}">
              {{ personnelMenu.title }}
            </el-menu-item>
            <el-menu-item-group title="账户信息">
              <el-menu-item
                  v-for="menu in accountMenus" :key="menu"
                  :index="menu.route"
                  :route="{name:menu.route}"
              >{{ menu.title }}
              </el-menu-item>
            </el-menu-item-group>
          </el-menu>
        </el-card>
      </el-aside>
      <el-main style="padding:10px;">
        <el-card>
          <router-view v-slot="{Component}">
            <keep-alive>
              <component :is="Component"/>
            </keep-alive>
          </router-view>
        </el-card>
      </el-main>
    </el-container>
  </el-scrollbar>
</template>

<script lang="ts">
import {useAppContext} from "@/libs/commons/psr/app-context";
import {computed, defineComponent} from "vue";
import {ROUTE_PERSONAL_CENTER_EMAILS, ROUTE_PERSONAL_CENTER_PASSWORD, ROUTE_PERSONAL_CENTER_PERSONNEL, ROUTE_PERSONAL_CENTER_PHONE_NUMBER} from "@/modules/personal-center/route";
import {PsrAppRouteRecordRaw} from "@/libs/commons/psr/app-context/route";

interface MenuItem {
  title: string,
  route: string
}

function createMenuItem(route: PsrAppRouteRecordRaw): MenuItem {
  const appContext = useAppContext();
  return {
    title: route.meta.tag.title,
    route: appContext.router.computeModuleRouteName(route.name)
  }
}

export default defineComponent({
  name: "personal-center",
  setup() {
    const appContext = useAppContext();
    const currentRoute = appContext.router.current
    const activeIndex = computed(() => currentRoute.value?.route.name)
    const accountRoutes: PsrAppRouteRecordRaw[] = [
      ROUTE_PERSONAL_CENTER_PASSWORD,
      ROUTE_PERSONAL_CENTER_PHONE_NUMBER,
      ROUTE_PERSONAL_CENTER_EMAILS
    ]
    const personnelMenu: MenuItem = createMenuItem(ROUTE_PERSONAL_CENTER_PERSONNEL)
    const accountMenus: MenuItem[] = accountRoutes.map(createMenuItem)
    return {
      activeIndex,
      personnelMenu,
      accountMenus
    }
  }
})
</script>

<style lang="scss" scoped>

</style>