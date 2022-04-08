<template>
  <el-container class="ct-root">
    <el-header class="ct-header">
      <el-page-header @back="handleGoBack">
        <template #content>content</template>
      </el-page-header>
    </el-header>
    <el-main class="ct-main">
      <h1>{{ groupId }} Users</h1>
    </el-main>
  </el-container>
</template>

<script lang="ts">
import {useRouter} from "vue-router";
import {ADMIN_CONSOLE_ROUTE_NAME} from "@/modules/admin-console/route";
import {defineComponent} from "vue";
import {computeModuleRouteName} from "@/libs/commons/app-context/computeModuleRoute";

export default defineComponent({
  name: "admin-console-group-user",
  props: {
    groupId: {
      type: String
    }
  },
  setup() {
    const router = useRouter()

    const backRouteName = computeModuleRouteName(ADMIN_CONSOLE_ROUTE_NAME.GROUP_LIST)

    function handleGoBack() {
      router.push({name: backRouteName})
    }

    return {
      handleGoBack
    }
  }
})
</script>

<style lang="scss" scoped>
.ct-root {
  height: 100%;
}

.ct-header {
  height: unset;
  padding: 12px 10px;
  border-bottom: var(--psr-border);
}
</style>