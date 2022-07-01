<template>
  <psr-toolbar>
    <router-link
        :to="{name:backRouteName}"
        custom
        v-slot="{navigate}"
    >
      <el-button link @click="navigate">
        <template #icon>
          <el-icon class="pi pi-arrow-left"/>
        </template>
        返回
      </el-button>
    </router-link>
    <el-divider direction="vertical"/>
    <span>分组: {{ groupCode }}</span>
    <el-divider direction="vertical"/>
    <el-button class="button" @click="$emit('refresh')">
      <template #icon>
        <el-icon class="pi pi-refresh"/>
      </template>
      刷新
    </el-button>
    <el-button class="button" @click="$emit('clearFilters')">
      <template #icon>
        <el-icon class="pi pi-filter-slash"/>
      </template>
      重置
    </el-button>
    <el-button class="button" @click="$emit('save')" :disabled="!dirty">
      <template #icon>
        <el-icon class="pi pi-save"/>
      </template>
      保存
    </el-button>
  </psr-toolbar>
</template>

<script>
import PsrToolbar from "@/libs/components/psr/widgets/toolbar/base";
import {useAppContext} from "@/libs/commons/psr/app-context";
import {ROUTE_PORTAL_GROUP_LIST} from "@/modules/admin-console/route";

export default {
  name: "header-bar",
  components: {PsrToolbar},
  props: {
    groupCode: String,
    dirty: Boolean
  },
  emits: ['refresh', 'clearFilters', 'save'],
  setup() {
    const backRouteName = useAppContext().router.computeModuleRouteName(ROUTE_PORTAL_GROUP_LIST.name)
    return {
      backRouteName
    }
  }
}
</script>

<style scoped>

</style>