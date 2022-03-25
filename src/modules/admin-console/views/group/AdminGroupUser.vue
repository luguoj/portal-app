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
import {ROUTE_NAME_ADMIN} from "@/modules/admin-console/route";
import {defineComponent} from "vue";

export default defineComponent({
  name: "AdminGroupUser",
  props: {
    groupId: {
      type: String
    }
  },
  setup() {
    const router = useRouter()

    function handleGoBack() {
      router.push({name: ROUTE_NAME_ADMIN.GROUP_LIST})
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
  border-bottom: 1px solid var(--el-border-color);
}
</style>