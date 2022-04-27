<template>
  <psr-toolbar>
    <el-button class="button" @click="$emit('find')">
      <template #icon>
        <el-icon class="pi pi-search"/>
      </template>
      查找
    </el-button>
    <el-button class="button" @click="$emit('clearFilters')">
      <template #icon>
        <el-icon class="pi pi-filter-slash"/>
      </template>
      重置
    </el-button>
    <el-button v-if="canAdd" class="button" @click="$emit('add')">
      <template #icon>
        <el-icon class="pi pi-plus"/>
      </template>
      添加
    </el-button>
  </psr-toolbar>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {ROUTE_AUTHORIZATION_USER_LIST} from "@/modules/admin-console/route";
import {useAppContext} from "@/libs/commons/app-context";
import PsrToolbar from "@/libs/components/psr/widgets/toolbar/PsrToolbar.vue";

export default defineComponent({
  name: "ViewPartHeader",
  components: {
    PsrToolbar
  },
  emits: ['add', 'find', 'clearFilters'],
  setup() {
    const appContext = useAppContext()
    const canAdd = appContext.permission.usePermissionFlag(ROUTE_AUTHORIZATION_USER_LIST.name, ['add'])
    return {
      canAdd
    }
  }
})
</script>

<style scoped>

</style>