<template>
  <el-container class="ct-root">
    <el-header class="ct-header">
      <el-page-header @back="handleGoBack">
        <template #content>content</template>
      </el-page-header>
    </el-header>
    <el-main class="ct-main">
      <h1>{{ groupId }} Authorities</h1>
    </el-main>
  </el-container>
</template>

<script>
import {useRouter} from "vue-router";
import {ROUTE_NAME_ADMIN} from "@/router/admin";

export default {
  name: "AdminGroupAuthority",
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
}
</script>

<style lang="scss" scoped>
.ct-root {
  height: 100%;
}

.ct-header {
  height: unset;
  padding: 12px 10px;
  border-bottom: 1px solid var(--el-border-color-base);
}
</style>